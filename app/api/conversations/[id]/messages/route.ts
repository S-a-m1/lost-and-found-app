import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendMessageSchema } from '@/lib/validations'

// GET /api/conversations/[id]/messages - Get messages in conversation
export async function GET(
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
    
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id }
    })
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    // Check if user is participant
    if (
      conversation.userAId !== session.user.id &&
      conversation.userBId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const messages = await prisma.message.findMany({
      where: {
        conversationId: params.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: params.id,
        senderId: {
          not: session.user.id
        },
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/conversations/[id]/messages - Send message
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
    
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id }
    })
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    // Check if user is participant
    if (
      conversation.userAId !== session.user.id &&
      conversation.userBId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = sendMessageSchema.parse(body)
    
    const message = await prisma.message.create({
      data: {
        conversationId: params.id,
        senderId: session.user.id,
        text: validatedData.text,
        attachmentUrl: validatedData.attachmentUrl
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })
    
    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: params.id },
      data: {
        lastMessageAt: new Date()
      }
    })
    
    // Create notification for the other user
    const recipientId = conversation.userAId === session.user.id 
      ? conversation.userBId 
      : conversation.userAId
    
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'NEW_MESSAGE',
        data: {
          conversationId: params.id,
          messageId: message.id,
          senderName: session.user.name || 'Someone'
        }
      }
    })
    
    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
