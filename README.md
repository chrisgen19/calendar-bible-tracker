# Bible Reading Calendar

A beautiful Next.js web application for tracking your daily Bible reading progress.

## Features

- 📅 Interactive calendar interface
- ✅ Track completed reading days
- 📖 Add notes about what you read each day
- 🎨 Clean, modern UI with Tailwind CSS
- 📊 Add readings with Bible Book, Chapters, Verses, and Date

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

## How to Use

1. Click "Add Reading" button or any day on the calendar to add your Bible reading
2. Fill in the Bible Book, Chapters, Verses fields
3. Select the Date Read (defaults to current PH date)
4. Click Save to mark the day as complete
5. Completed days show in green with a checkmark
6. Navigate between months using the arrow buttons

## Technologies Used

- Next.js 14
- React 18
- Tailwind CSS
- Lucide React (icons)

## Project Structure

```
calendar/
├── app/
│   ├── layout.jsx       # Root layout with metadata
│   ├── page.jsx         # Main calendar page
│   └── globals.css      # Global styles
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## License

MIT