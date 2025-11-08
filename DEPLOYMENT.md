# Deployment Guide

This guide walks through deploying the Lost & Found application to production.

## Prerequisites

1. A Vercel account (free tier works)
2. A PostgreSQL database (Neon, Supabase, or AWS RDS)
3. Git repository with the code

## Step 1: Set Up PostgreSQL Database

### Option A: Neon (Recommended for beginners)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://user:password@host/dbname?sslmode=require`)

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database and copy the Connection String (URI format)

### Option C: AWS RDS

1. Create a PostgreSQL instance in AWS RDS
2. Configure security groups to allow connections
3. Note down the connection string

## Step 2: Prepare for Deployment

1. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Save this value for later.

2. **Test Locally First** (recommended)
   ```bash
   # Set up your local .env file
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-generated-secret"
   
   # Install dependencies
   npm install
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # (Optional) Seed the database
   npm run seed
   
   # Test the app
   npm run dev
   ```

## Step 3: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Next.js project
5. Before deploying, add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: The secret you generated with openssl
6. Click "Deploy"

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to link to your project
# Add environment variables when prompted
```

## Step 4: Set Up Database in Production

After your first deployment:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# (Optional) Seed the database with demo data
npx prisma db seed
```

Or run migrations directly in Vercel:

1. Go to your project in Vercel
2. Go to Settings > Environment Variables
3. Make sure `DATABASE_URL` is set correctly
4. Deploy again to trigger migrations

## Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to Settings > Domains
3. Add your custom domain
4. Update your DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable with your new domain
6. Redeploy

## Step 6: Post-Deployment Checks

1. **Test Authentication**
   - Try registering a new account
   - Try logging in
   - Check that sessions work correctly

2. **Test Item Creation**
   - Create a lost item
   - Create a found item
   - Verify they appear in browse page

3. **Test Search**
   - Use filters
   - Search by keywords
   - Check pagination

4. **Test Chat**
   - Message an item owner
   - Verify messages are saved
   - Check notifications

## Environment Variables Reference

Required for production:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-production-url.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

Optional for future enhancements:

```env
# File Upload (S3 or Cloudinary)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET_NAME=""

# OR
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email (for notifications)
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check that `DATABASE_URL` is correctly set in Vercel
2. Verify your database allows connections from Vercel IPs
3. Ensure SSL mode is configured correctly
4. Check database credentials

### NextAuth Errors

If authentication doesn't work:

1. Verify `NEXTAUTH_URL` matches your production URL
2. Check that `NEXTAUTH_SECRET` is set and is sufficiently long
3. Clear browser cookies and try again
4. Check Vercel function logs for detailed errors

### Build Failures

If the build fails:

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript has no errors locally
4. Check that Prisma schema is valid

### Migration Issues

If migrations fail:

1. Manually run migrations: `npx prisma migrate deploy`
2. Check database permissions
3. Verify Prisma schema is correct
4. Check for conflicting schema changes

## Monitoring and Logs

### Vercel Dashboard

- Go to your project
- Click on a deployment
- View function logs, build logs, and runtime logs

### Database Monitoring

For Neon:
- Dashboard shows query statistics
- Monitor connection count
- Check storage usage

For Supabase:
- SQL Editor to run queries
- Table Editor for data inspection
- Logs for database operations

## Scaling Considerations

As your app grows:

1. **Database**
   - Consider connection pooling (PgBouncer)
   - Upgrade database plan for more connections
   - Add read replicas for high traffic

2. **Caching**
   - Add Redis for session storage
   - Cache frequently accessed data
   - Use CDN for static assets

3. **Performance**
   - Monitor Vercel analytics
   - Optimize database queries
   - Add database indexes for search fields

4. **Security**
   - Add rate limiting (Upstash Rate Limit)
   - Implement reCAPTCHA for forms
   - Regular security audits

## Backup Strategy

1. **Database Backups**
   - Neon and Supabase provide automatic backups
   - AWS RDS: Configure automated backup retention

2. **Code Backups**
   - Keep Git repository synced
   - Tag releases: `git tag v1.0.0`

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Prisma Documentation](https://www.prisma.io/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## Success!

Once deployed, your Lost & Found platform will be live at your Vercel URL. Share it with users and start helping people reunite with their belongings!
