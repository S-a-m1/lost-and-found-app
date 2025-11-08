import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createItemSchema, itemSearchSchema } from '@/lib/validations'

// GET /api/items - List and search items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams)
    
    const validatedParams = itemSearchSchema.parse(params)
    
    const where: any = {
      isClosed: false, // By default, don't show closed items
    }
    
    if (validatedParams.status) {
      where.status = validatedParams.status
    }
    
    if (validatedParams.category) {
      where.category = validatedParams.category
    }
    
    if (validatedParams.q) {
      where.OR = [
        { name: { contains: validatedParams.q, mode: 'insensitive' } },
        { description: { contains: validatedParams.q, mode: 'insensitive' } }
      ]
    }
    
    if (validatedParams.location) {
      where.locationText = { contains: validatedParams.location, mode: 'insensitive' }
    }
    
    if (validatedParams.from || validatedParams.to) {
      where.date = {}
      if (validatedParams.from) {
        where.date.gte = new Date(validatedParams.from)
      }
      if (validatedParams.to) {
        where.date.lte = new Date(validatedParams.to)
      }
    }
    
    const skip = (validatedParams.page - 1) * validatedParams.limit
    
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          images: {
            take: 1,
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: validatedParams.limit
      }),
      prisma.item.count({ where })
    ])
    
    return NextResponse.json({
      items,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages: Math.ceil(total / validatedParams.limit)
      }
    })
  } catch (error: any) {
    console.error('Items GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

// POST /api/items - Create new item (requires auth)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = createItemSchema.parse(body)
    
    // Extract images from body
    const { images, ...itemData } = body
    
    // Create item with images
    const item = await prisma.item.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId: session.user.id,
        images: images ? {
          create: images.map((img: any) => ({
            url: img.url,
            width: img.width,
            height: img.height
          }))
        } : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        images: true
      }
    })
    
    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Item creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}
