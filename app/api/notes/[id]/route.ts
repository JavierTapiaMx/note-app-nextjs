import { NextRequest, NextResponse } from "next/server";
import { noteSchema } from "../schema";
import { noteRepository } from "@/services/noteRepository";

type RouteParams = {
  id: string;
};

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) => {
  try {
    const { id } = await params;
    const noteId = parseInt(id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note Id" }, { status: 400 });
    }

    const note = await noteRepository.findById(noteId);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
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
  { params }: { params: Promise<RouteParams> }
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

    const existsNote = await noteRepository.exists(noteId);

    if (!existsNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const updatedNote = await noteRepository.update(noteId, validation.data);

    return NextResponse.json(updatedNote);
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
  { params }: { params: Promise<RouteParams> }
) => {
  try {
    const { id } = await params;
    const noteId = parseInt(id);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: "Invalid note Id" }, { status: 400 });
    }

    const existsNote = await noteRepository.exists(noteId);

    if (!existsNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await noteRepository.delete(noteId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete note:", error);

    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
};
