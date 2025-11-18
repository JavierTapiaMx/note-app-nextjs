"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useDeleteNote } from "@/hooks/useDeleteNote";
import { Trash2 } from "lucide-react";

interface DeleteNoteButtonProps {
  noteId: number;
  noteTitle: string;
}

export const DeleteNoteButton = ({
  noteId,
  noteTitle
}: DeleteNoteButtonProps) => {
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const handleDelete = () => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${noteTitle}"? This action cannot be undone.`
    );

    if (shouldDelete) {
      deleteNote(noteId);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Delete note</p>
      </TooltipContent>
    </Tooltip>
  );
};
