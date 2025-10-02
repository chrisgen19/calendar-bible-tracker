import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all readings for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let whereClause = { userId };

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month), 1);
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59);

      whereClause.dateRead = {
        gte: startDate,
        lte: endDate
      };
    }

    const readings = await prisma.bibleReading.findMany({
      where: whereClause,
      orderBy: {
        dateRead: 'desc'
      }
    });

    return NextResponse.json(readings);
  } catch (error) {
    console.error('Error fetching readings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new reading
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, bibleBook, chapters, verses, dateRead, completed, notes } = body;

    if (!userId || !bibleBook || !chapters || !dateRead) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reading = await prisma.bibleReading.create({
      data: {
        userId,
        bibleBook,
        chapters,
        verses: verses || '',
        dateRead: new Date(dateRead),
        completed: completed || true,
        notes: notes || ''
      }
    });

    return NextResponse.json(reading, { status: 201 });
  } catch (error) {
    console.error('Error creating reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
