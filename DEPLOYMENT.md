# Deployment Guide for Coolify

## Prerequisites

1. A PostgreSQL database (Coolify can provision this for you)
2. GitHub repository connected to Coolify

## Environment Variables

Configure these environment variables in Coolify before deploying:

### Required Variables

```
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

Replace with your actual database connection string.

### For Self-hosted Supabase

If you're using self-hosted Supabase (like in this project), you only need the `DATABASE_URL`:

```
DATABASE_URL=postgresql://postgres:your_password@your_ip:5432/postgres?sslmode=require
```

**Note:** You do NOT need the Supabase anon key or service role key when using Prisma with direct PostgreSQL connection. Those are only needed if using Supabase's client SDK features.

## Important Files

This project includes a `nixpacks.toml` file that configures how Coolify/Nixpacks builds the application. This file ensures the app is deployed as a Next.js server (not a static site).

## Deployment Steps

### 1. Set up PostgreSQL Database in Coolify

- Create a new PostgreSQL database resource in Coolify
- Note the connection string provided

### 2. Configure Your Application

- Add your application from GitHub
- Set the environment variable `DATABASE_URL` with your PostgreSQL connection string
- Nixpacks will automatically detect the `nixpacks.toml` configuration

### 3. Run Database Migrations

After the first successful deployment, you need to run migrations:

**Option A: Using Coolify's terminal**
- Go to your app in Coolify
- Open the terminal/console
- Run: `npm run migrate:deploy`

**Option B: Using a post-deployment script**
Add this to your Coolify configuration as a post-deployment command:
```bash
npm run migrate:deploy
```

### 4. Redeploy

Your application should now be running successfully!

## Troubleshooting

### Build fails with DATABASE_URL error

- Make sure `DATABASE_URL` is set in Coolify environment variables
- The build process no longer runs migrations (moved to separate command)
- Ensure the database is accessible from your application

### Database connection issues

- Verify the `DATABASE_URL` format is correct
- Check that the database service is running
- Ensure network connectivity between app and database

### Prisma errors

If you see Prisma-related errors:
- Run `npm run migrate:deploy` after deployment
- Check that prisma schema is up to date

## Environment Variable Format

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Example:
```
DATABASE_URL="postgresql://myuser:mypassword@postgres.coolify.local:5432/biblecalendar?schema=public"
```
