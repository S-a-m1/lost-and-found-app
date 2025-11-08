import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/items/[id]/conversations - Create or get existing conversation
export async function POST(
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
    
    // Can't create conversation with yourself
    if (item.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 }
      )
    }
    
    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        itemId: params.id,
        OR: [
          { userAId: session.user.id, userBId: item.userId },
          { userAId: item.userId, userBId: session.user.id }
        ]
      },
      include: {
        item: {
          include: {
            images: {
              take: 1
            }
          }
        },
        userA: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })
    
    if (existingConversation) {
      return NextResponse.json(existingConversation)
    }
    
    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        itemId: params.id,
        userAId: session.user.id,
        userBId: item.userId
      },
      include: {
        item: {
          include: {
            images: {
              take: 1
            }
          }
        },
        userA: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        userB: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        messages: true
      }
    })
    
    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Conversation creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
