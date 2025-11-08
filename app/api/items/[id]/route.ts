import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateItemSchema } from '@/lib/validations'

// GET /api/items/[id] - Get single item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            // Only include contact details if user is logged in
            ...(session?.user && {
              email: true
            })
          }
        },
        images: true
      }
    })
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    // Mask contact details if user is not logged in
    if (!session?.user) {
      const { contactEmail, contactPhone, ...itemWithoutContact } = item
      return NextResponse.json(itemWithoutContact)
    }
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('Item GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

// PATCH /api/items/[id] - Update item (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const item = await prisma.item.findUnique({
      where: { id: params.id }
    })
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    if (item.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = updateItemSchema.parse(body)
    
    const updatedItem = await prisma.item.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ...(validatedData.date && { date: new Date(validatedData.date) })
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
    
    return NextResponse.json(updatedItem)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Item update error:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

// DELETE /api/items/[id] - Delete item (owner or admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const item = await prisma.item.findUnique({
      where: { id: params.id }
    })
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    if (item.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    await prisma.item.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json(
      { message: 'Item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Item delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
