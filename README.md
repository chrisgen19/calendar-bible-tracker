# Bible Reading Calendar

A beautiful Next.js web application for tracking your daily Bible reading progress with notes and user authentication.

## Features

- 📅 **Interactive Calendar Interface** - Beautiful month view with easy navigation
- ✅ **Track Completed Readings** - Visual indicators for completed and missed days
- 📖 **Multiple Readings Per Day** - Add multiple Bible readings for the same date
- 📝 **Notes Feature** - Add personal notes and reflections for each reading
- 👤 **User Authentication** - Secure login and registration system
- 🎨 **Clean, Modern UI** - Built with Tailwind CSS
- 📊 **Detailed Reading Tracking** - Track Bible Book, Chapters, Verses, and Date
- 🌏 **Philippines Timezone** - Defaults to PH time for convenience
- ♻️ **Auto-suggestion** - Smart autocomplete for Bible book names

## Tech Stack

- **Frontend:** Next.js 14, React 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Bcrypt for password hashing
- **Deployment:** Vercel

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

### 2. Clone the Repository

```bash
git clone <your-repo-url>
cd calendar
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/biblecalendar"
```

Replace with your actual PostgreSQL connection string.

### 5. Database Setup

Run Prisma migrations to set up your database:

```bash
npx prisma migrate dev
```

This will create the necessary tables:
- `users` - User accounts
- `bible_readings` - Reading records
- `reading_notes` - Notes for each reading

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 8. Build for Production

```bash
npm run build
```

### 9. Start Production Server

```bash
npm start
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

- Go to [Vercel Dashboard](https://vercel.com)
- Import your GitHub repository
- Add environment variable: `DATABASE_URL`

### 3. Apply Database Migrations

Before the first deployment, run migrations on your production database:

```bash
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

Or manually run the SQL from `prisma/migrations/` in your database console.

### 4. Deploy

Vercel will automatically deploy on every push to main branch.

## How to Use

### Adding a Reading

**Method 1: From Calendar**
1. Click on any day in the calendar
2. Fill in Bible Book, Chapters, and Verses
3. Optionally click "Add Notes" to add personal reflections
4. Click Save

**Method 2: From Add Reading Button**
1. Click the "+ Add Reading" button in the header
2. Fill in the reading details
3. Add notes if desired
4. Click Save

### Managing Notes

- **Add Notes:** Click "Add Notes" button while creating a reading
- **Edit Notes:** When editing a reading, the button changes to "Edit Notes"
- Notes are saved with the reading and persist in the database

### Editing & Deleting

1. Click on a day with existing readings
2. Click "Edit" on any reading to modify it
3. Click "Delete" to remove a reading
4. You can have multiple readings on the same day

### Calendar Features

- **Green Days:** Completed readings
- **Red Days:** Missed days (past days with no reading)
- **Blue Border:** Today's date
- **Reading Count:** Shows number of readings on each day

## Project Structure

```
calendar/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js       # Login endpoint
│   │   │   └── register/route.js    # Registration endpoint
│   │   ├── readings/
│   │   │   ├── route.js             # CRUD for readings
│   │   │   └── [id]/route.js        # Update/Delete specific reading
│   │   └── notes/
│   │       ├── route.js             # CRUD for notes
│   │       └── [id]/route.js        # Update/Delete specific note
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication context
│   ├── login/
│   │   └── page.jsx                 # Login page
│   ├── register/
│   │   └── page.jsx                 # Registration page
│   ├── layout.jsx                   # Root layout
│   ├── page.jsx                     # Main calendar page
│   └── globals.css                  # Global styles
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Database migrations
├── lib/
│   └── prisma.js                    # Prisma client instance
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Database Schema

### Users Table
- User authentication and profile information
- Email, password (hashed), name, gender, etc.

### Bible Readings Table
- Reading records with book, chapters, verses
- Links to user and date
- Completion status

### Reading Notes Table
- Personal notes and reflections
- Links to specific Bible readings
- Timestamps for tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Readings
- `GET /api/readings?userId=...&month=...&year=...` - Fetch readings
- `POST /api/readings` - Create reading
- `PUT /api/readings/[id]` - Update reading
- `DELETE /api/readings/[id]` - Delete reading

### Notes
- `GET /api/notes?bibleReadingId=...` - Fetch notes for a reading
- `POST /api/notes` - Create note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

## Development Notes

### Database Migrations

When you make schema changes:

```bash
# Development
npx prisma migrate dev --name description_of_changes

# Production
npx prisma migrate deploy
```

### Resetting Database (Development Only)

```bash
npx prisma migrate reset
```

⚠️ **Warning:** This will delete all data!

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct in `.env`
- Ensure PostgreSQL is running
- Check firewall/network settings

### Migration Errors on Vercel
- Run migrations manually on production database
- Use `prisma migrate deploy` not `prisma migrate dev`

### Missing Tables
- Run `npx prisma migrate deploy` on your production database
- Or manually execute SQL from migration files

## Contributing

Feel free to submit issues and pull requests!

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
