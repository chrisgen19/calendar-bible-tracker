import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get a specific note by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const note = await prisma.readingNote.findUnique({
      where: { id }
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific note
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const note = await prisma.readingNote.update({
      where: { id },
      data: { content }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific note
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.readingNote.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
