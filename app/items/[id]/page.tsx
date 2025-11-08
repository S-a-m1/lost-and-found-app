import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { formatDate, capitalize, maskEmail, maskPhone } from '@/lib/utils'
import Link from 'next/link'

async function getItem(id: string, session: any) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/items/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching item:', error)
    return null
  }
}

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const item = await getItem(params.id, session)

  if (!item) {
    notFound()
  }

  const isOwner = session?.user?.id === item.userId
  const canViewContact = !!session

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {item.images && item.images.length > 0 ? (
            <div className="space-y-2">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={item.images[0].url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(1, 5).map((img: any, idx: number) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={img.url}
                        alt={`${item.name} ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    item.status === 'LOST'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-gray-600">{item.description}</p>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="font-medium">Category:</span>
                <span className="ml-2">{capitalize(item.category)}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Location:</span>
                <span className="ml-2">{item.locationText}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Date:</span>
                <span className="ml-2">{formatDate(item.date)}</span>
              </div>

              {item.isClosed && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">
                    ✓ This item has been reunited with its owner
                  </p>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              {!canViewContact ? (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-3">
                    Sign in to view contact details and message the poster
                  </p>
                  <Link
                    href={`/login?callbackUrl=/items/${item.id}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              ) : isOwner ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">This is your item</p>
                  <Link
                    href={`/items/${item.id}/edit`}
                    className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Edit Item
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {item.user.image ? (
                      <img
                        src={item.user.image}
                        alt={item.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {item.user.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{item.user.name}</p>
                      {item.contactEmail && (
                        <p className="text-sm text-gray-600">{maskEmail(item.contactEmail)}</p>
                      )}
                    </div>
                  </div>
                  <form action={`/api/items/${item.id}/conversations`} method="POST">
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Message Poster
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link
          href="/browse"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Browse
        </Link>
      </div>
    </div>
  )
}
