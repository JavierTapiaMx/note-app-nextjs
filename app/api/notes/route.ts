import { db } from "@/db/drizzle";
import { notesTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { noteSchema } from "./schema";

export const GET = async () => {
  try {
    const notes = await db
      .select()
      .from(notesTable)
      .orderBy(desc(notesTable.createdAt));

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);

    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const validation = noteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.issues },
        { status: 400 }
      );
    }

    const newNoteId = await db
      .insert(notesTable)
      .values({
        title: validation.data.title,
        content: validation.data.content
      })
      .$returningId();

    return NextResponse.json({ id: newNoteId[0].id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
};
