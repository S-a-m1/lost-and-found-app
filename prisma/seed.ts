import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.itemImage.deleteMany()
  await prisma.item.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        hashedPassword,
        bio: 'Tech enthusiast and frequent traveler'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        hashedPassword,
        bio: 'Pet lover and community helper'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        hashedPassword,
        bio: 'Always happy to help reunite people with their belongings'
      }
    })
  ])

  console.log(`Created ${users.length} users`)

  // Create items
  const items = await Promise.all([
    // Lost items
    prisma.item.create({
      data: {
        userId: users[0].id,
        status: 'LOST',
        name: 'iPhone 13 Pro',
        description: 'Black iPhone 13 Pro with a cracked screen protector. Lost near Central Park entrance. Has a blue case with a popsocket.',
        category: 'ELECTRONICS',
        locationText: 'Central Park, New York',
        date: new Date('2024-01-15'),
        contactEmail: 'john@example.com'
      }
    }),
    prisma.item.create({
      data: {
        userId: users[0].id,
        status: 'LOST',
        name: 'House Keys with Red Keychain',
        description: 'Set of 3 keys on a red leather keychain with initials "JD". Lost somewhere between Main Street and Oak Avenue.',
        category: 'KEYS',
        locationText: 'Main Street, Downtown Seattle',
        date: new Date('2024-01-20'),
        contactPhone: '+1 (555) 123-4567'
      }
    }),
    prisma.item.create({
      data: {
        userId: users[1].id,
        status: 'LOST',
        name: 'Golden Retriever',
        description: 'Friendly golden retriever named Max. Wearing a blue collar with a tag. Very friendly but may be scared. Please contact if found!',
        category: 'PETS',
        locationText: 'Riverside Park, Portland',
        date: new Date('2024-01-18'),
        contactEmail: 'jane@example.com',
        contactPhone: '+1 (555) 987-6543'
      }
    }),
    prisma.item.create({
      data: {
        userId: users[1].id,
        status: 'LOST',
        name: 'Black Leather Wallet',
        description: 'Black leather wallet containing ID, credit cards, and some cash. Lost at Starbucks on 5th Avenue. Very sentimental value.',
        category: 'WALLET',
        locationText: 'Starbucks, 5th Avenue, Manhattan',
        date: new Date('2024-01-22'),
        contactEmail: 'jane@example.com'
      }
    }),
    // Found items
    prisma.item.create({
      data: {
        userId: users[2].id,
        status: 'FOUND',
        name: 'Blue Backpack',
        description: 'Blue Nike backpack found at the bus stop. Contains textbooks and a laptop. Contact to claim and verify contents.',
        category: 'BAGS',
        locationText: 'Bus Stop, University District',
        date: new Date('2024-01-19'),
        contactEmail: 'bob@example.com'
      }
    }),
    prisma.item.create({
      data: {
        userId: users[2].id,
        status: 'FOUND',
        name: 'Silver Ring',
        description: 'Beautiful silver ring with small diamonds. Found in the restroom at the mall. Contact with description to verify ownership.',
        category: 'JEWELRY',
        locationText: 'Westfield Mall, San Francisco',
        date: new Date('2024-01-21'),
        contactEmail: 'bob@example.com'
      }
    }),
    prisma.item.create({
      data: {
        userId: users[0].id,
        status: 'FOUND',
        name: 'Passport and Documents',
        description: 'Found a passport and some travel documents near the airport terminal. Contact to verify identity and claim.',
        category: 'DOCUMENTS',
        locationText: 'Airport Terminal 2, LAX',
        date: new Date('2024-01-23'),
        contactEmail: 'john@example.com'
      }
    }),
    prisma.item.create({
      data: {
        userId: users[1].id,
        status: 'FOUND',
        name: 'AirPods Pro',
        description: 'Found white AirPods Pro in charging case at the gym. Case has a small scratch on the lid.',
        category: 'ELECTRONICS',
        locationText: '24 Hour Fitness, Downtown',
        date: new Date('2024-01-24'),
        contactPhone: '+1 (555) 111-2222'
      }
    })
  ])

  console.log(`Created ${items.length} items`)

  // Create some conversations and messages
  const conversation1 = await prisma.conversation.create({
    data: {
      itemId: items[0].id,
      userAId: users[1].id,
      userBId: users[0].id,
      messages: {
        create: [
          {
            senderId: users[1].id,
            text: 'Hi! I think I may have seen your iPhone near the park entrance. Can you describe it in more detail?'
          },
          {
            senderId: users[0].id,
            text: 'Hi! Yes, it\'s a black iPhone 13 Pro with a blue case that has a popsocket on the back. The screen protector is cracked.'
          },
          {
            senderId: users[1].id,
            text: 'That sounds like the one I saw! I left a note with the park office. They\'re holding it for you.'
          }
        ]
      }
    }
  })

  const conversation2 = await prisma.conversation.create({
    data: {
      itemId: items[4].id,
      userAId: users[0].id,
      userBId: users[2].id,
      messages: {
        create: [
          {
            senderId: users[0].id,
            text: 'Hello, I think this might be my backpack. It has my name written inside the front pocket.'
          },
          {
            senderId: users[2].id,
            text: 'Great! What\'s the name written inside?'
          }
        ]
      }
    }
  })

  console.log('Created conversations and messages')

  // Create some notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: users[0].id,
        type: 'NEW_MESSAGE',
        data: {
          conversationId: conversation1.id,
          senderName: 'Jane Smith'
        }
      },
      {
        userId: users[2].id,
        type: 'NEW_MESSAGE',
        data: {
          conversationId: conversation2.id,
          senderName: 'John Doe'
        }
      }
    ]
  })

  console.log('Created notifications')
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
