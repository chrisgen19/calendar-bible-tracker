import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Create a new note for a bible reading
export async function POST(request) {
  try {
    const body = await request.json();
    const { bibleReadingId, content } = body;

    if (!bibleReadingId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const note = await prisma.readingNote.create({
      data: {
        bibleReadingId,
        content
      }
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get all notes for a bible reading
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bibleReadingId = searchParams.get('bibleReadingId');

    if (!bibleReadingId) {
      return NextResponse.json(
        { error: 'Missing bibleReadingId parameter' },
        { status: 400 }
      );
    }

    const notes = await prisma.readingNote.findMany({
      where: {
        bibleReadingId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
