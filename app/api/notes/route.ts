import { NextRequest, NextResponse } from "next/server";
import { noteSchema } from "./schema";
import { noteRepository } from "@/services/noteRepository";

export const GET = async () => {
  try {
    const notes = await noteRepository.findAll();

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
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = noteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.issues },
        { status: 400 }
      );
    }

    const newNoteId = await noteRepository.create({
      title: validation.data.title,
      content: validation.data.content
    });

    const newNote = await noteRepository.findById(newNoteId);

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
};
