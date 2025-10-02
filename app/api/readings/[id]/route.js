import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch a single reading
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const reading = await prisma.bibleReading.findUnique({
      where: { id }
    });

    if (!reading) {
      return NextResponse.json(
        { error: 'Reading not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(reading);
  } catch (error) {
    console.error('Error fetching reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a reading
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { bibleBook, chapters, verses, dateRead, completed, notes } = body;

    const reading = await prisma.bibleReading.update({
      where: { id },
      data: {
        ...(bibleBook && { bibleBook }),
        ...(chapters && { chapters }),
        ...(verses !== undefined && { verses }),
        ...(dateRead && { dateRead: new Date(dateRead) }),
        ...(completed !== undefined && { completed }),
        ...(notes !== undefined && { notes })
      }
    });

    return NextResponse.json(reading);
  } catch (error) {
    console.error('Error updating reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a reading
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.bibleReading.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Reading deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
