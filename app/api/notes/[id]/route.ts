import { db } from "@/db/drizzle";
import { notesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { noteSchema } from "../schema";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const noteId = parseInt(id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note Id" }, { status: 400 });
    }

    const note = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, noteId))
      .limit(1);

    if (note.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note[0]);
  } catch (error) {
    console.error("Failed to fetch note:", error);

    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const noteId = parseInt(id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note Id" }, { status: 400 });
    }

    const body = await request.json();

    const validation = noteSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.issues },
        { status: 400 }
      );
    }

    const existingNote = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, noteId))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await db
      .update(notesTable)
      .set({
        ...validation.data,
        updatedAt: new Date()
      })
      .where(eq(notesTable.id, noteId));

    const updatedNote = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, noteId))
      .limit(1);

    return NextResponse.json(updatedNote[0]);
  } catch (error) {
    console.error("Failed to update note:", error);

    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const noteId = parseInt(id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note Id" }, { status: 400 });
    }

    const existingNote = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, noteId))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await db.delete(notesTable).where(eq(notesTable.id, noteId));

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete note:", error);

    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
};
