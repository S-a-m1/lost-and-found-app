'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/chat')
    } else if (status === 'authenticated') {
      fetchConversations()
    }
  }, [status])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start messaging by browsing items and contacting their owners
            </p>
            <div className="mt-6">
              <Link
                href="/browse"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Items
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation: any) => {
              const otherUser = conversation.userA.id === session?.user?.id 
                ? conversation.userB 
                : conversation.userA
              const lastMessage = conversation.messages[0]

              return (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {otherUser.image ? (
                        <img
                          src={otherUser.image}
                          alt={otherUser.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-lg">
                            {otherUser.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {otherUser.name}
                        </p>
                        {lastMessage && (
                          <p className="text-xs text-gray-500">
                            {formatRelativeTime(lastMessage.createdAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {conversation.item.images && conversation.item.images[0] && (
                          <img
                            src={conversation.item.images[0].url}
                            alt={conversation.item.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.item.name}
                        </p>
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
