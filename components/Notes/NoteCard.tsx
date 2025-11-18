"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type Note from "@/types/Note";
import Link from "next/link";
import { DeleteNoteButton } from "./DeleteNoteButton";

interface Props {
  note: Note;
}

const NoteCard = ({ note }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle>
              <Link
                href={`/notes/${note.id}/edit`}
                className="hover:text-primary cursor-pointer transition-colors"
              >
                {note.title}
              </Link>
            </CardTitle>
            <CardDescription>{note.content}</CardDescription>
          </div>
          <DeleteNoteButton noteId={note.id} noteTitle={note.title} />
        </div>
      </CardHeader>
    </Card>
  );
};

export default NoteCard;
