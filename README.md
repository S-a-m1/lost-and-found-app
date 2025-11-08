# Lost & Found - Modern Web Platform

A modern, minimalistic, mobile-first Lost & Found web platform that lets people report and discover lost/found items and securely connect via a dedicated chat interface.

## Features

### Core Functionality
- **User Authentication**: Secure sign-up, login, and session management using NextAuth
- **Item Management**: Report lost or found items with detailed descriptions, categories, photos, and location
- **Advanced Search**: Browse and filter items by status, category, location, and keywords
- **Private Messaging**: Secure, real-time chat between item posters and interested users
- **User Profiles**: Manage personal information, bio, and avatar
- **Notifications**: Get notified about new messages and item interactions
- **Responsive Design**: Mobile-first, minimalistic UI with excellent accessibility

### Technical Highlights
- **Next.js 16** with App Router for optimal performance
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL for robust data management
- **NextAuth** for authentication with credentials provider
- **Tailwind CSS** for minimalistic, modern styling
- **Server-side rendering** for SEO optimization
- **RESTful API** with comprehensive endpoints

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- next-auth for session management

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth for authentication
- Zod for validation

### Authentication
- NextAuth with Credentials Provider
- JWT sessions
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/S-a-m1/lost-and-found-app.git
   cd lost-and-found-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/lostfound?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lost-and-found-app/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── items/           # Item CRUD endpoints
│   │   ├── conversations/   # Chat endpoints
│   │   ├── notifications/   # Notification endpoints
│   │   └── users/           # User profile endpoints
│   ├── browse/              # Browse items page
│   ├── items/               # Item pages (detail, new, edit)
│   ├── chat/                # Chat pages
│   ├── login/               # Login page
│   ├── register/            # Register page
│   ├── profile/             # User profile page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── navigation.tsx       # Navigation bar
│   └── providers.tsx        # Session provider wrapper
├── lib/                     # Utility functions and configs
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── validations.ts      # Zod schemas
│   └── utils.ts            # Helper functions
├── prisma/                  # Database schema and migrations
│   └── schema.prisma       # Prisma schema
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)

### Items
- `GET /api/items` - List and search items (with filters)
- `POST /api/items` - Create new item (authenticated)
- `GET /api/items/[id]` - Get item details
- `PATCH /api/items/[id]` - Update item (owner only)
- `DELETE /api/items/[id]` - Delete item (owner only)

### Conversations & Messages
- `POST /api/items/[id]/conversations` - Create or get conversation (authenticated)
- `GET /api/conversations` - List user's conversations (authenticated)
- `GET /api/conversations/[id]` - Get conversation details (authenticated)
- `GET /api/conversations/[id]/messages` - Get messages (authenticated)
- `POST /api/conversations/[id]/messages` - Send message (authenticated)

### Users
- `GET /api/users/me` - Get current user profile (authenticated)
- `PATCH /api/users/me` - Update profile (authenticated)

### Notifications
- `GET /api/notifications` - List notifications (authenticated)
- `PATCH /api/notifications/[id]/read` - Mark as read (authenticated)

## Database Schema

### Core Models
- **User**: User accounts and profiles
- **Item**: Lost and found items
- **ItemImage**: Item photos
- **Conversation**: Chat threads between users
- **Message**: Chat messages
- **Notification**: User notifications
- **Favorite**: Saved items (optional)
- **AbuseReport**: Report system (optional)

## Key Features Implementation

### Authentication Flow
1. User registers with email and password
2. Password is hashed using bcrypt
3. User logs in using NextAuth credentials provider
4. JWT token is issued for session management
5. Protected routes check for valid session

### Item Posting Flow
1. User navigates to "Report Item" page
2. Fills out form with item details (name, status, category, description, location, date)
3. Form data is validated using Zod schemas
4. Item is created in database with user association
5. User is redirected to item detail page

### Chat Flow
1. User views an item and clicks "Message Poster"
2. System creates or retrieves existing conversation
3. User can send text messages
4. Messages are stored in database
5. Recipient receives notification
6. Chat displays in real-time

### Search & Browse
1. Users can browse all items on the browse page
2. Filters: status (lost/found), category, location, keywords
3. Results are paginated (20 items per page)
4. Items display thumbnail, title, description, location, and date

## Security Features

- Password hashing with bcrypt
- JWT session tokens
- Server-side authentication checks
- Input validation with Zod
- SQL injection prevention via Prisma
- Contact details masked for non-authenticated users
- CSRF protection via NextAuth

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast compliance (WCAG 2.1 AA)
- Responsive design for all screen sizes

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Run Prisma Studio (database GUI)
npx prisma studio
```

### Environment Variables

See `.env.example` for all available configuration options.

## Deployment

### Recommended Stack
- **Frontend/API**: Vercel
- **Database**: Neon, Supabase, or AWS RDS (PostgreSQL)
- **File Storage**: AWS S3 or Cloudinary (for future image upload feature)

### Deployment Steps

1. **Set up PostgreSQL database**
   - Create a production database (e.g., on Neon or Supabase)
   - Copy the connection string

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Configure environment variables in Vercel**
   - Add `DATABASE_URL`
   - Add `NEXTAUTH_URL` (your production URL)
   - Add `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

## Future Enhancements

- [ ] Image upload functionality (S3/Cloudinary integration)
- [ ] Real-time chat with WebSockets (Socket.IO)
- [ ] Email notifications
- [ ] Map view with location pins (Leaflet/OpenStreetMap)
- [ ] Image similarity search
- [ ] OAuth providers (Google, Facebook)
- [ ] Admin dashboard
- [ ] Report and moderation system
- [ ] Mobile apps (React Native)
- [ ] Push notifications
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)
- Authentication with [NextAuth](https://next-auth.js.org/)
