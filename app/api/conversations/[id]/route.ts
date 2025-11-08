import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/conversations/[id] - Get conversation details
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
      where: { id: params.id },
      include: {
        item: {
          include: {
            images: true
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
        }
      }
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
    
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Conversation GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}
