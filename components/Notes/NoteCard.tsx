"use client";

import Link from "next/link";
import type Note from "@/types/Note";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { useDeleteNote } from "@/hooks/useDeleteNote";

interface Props {
  note: Note;
}

const NoteCard = ({ note }: Props) => {
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const handleDelete = () => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${note.title}"? This action cannot be undone.`
    );

    if (shouldDelete) {
      deleteNote(note.id);
    }
  };

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="shrink-0 cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                aria-label={`Delete note: ${note.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete note</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
    </Card>
  );
};

export default NoteCard;
