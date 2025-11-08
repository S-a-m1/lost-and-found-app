import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/conversations - List user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userAId: session.user.id },
          { userBId: session.user.id }
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
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    })
    
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Conversations GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
