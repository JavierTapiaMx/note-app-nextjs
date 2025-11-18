"use client";

import Link from "next/link";
import NotesEmpty from "@/components/Notes/NotesEmpty";
import NotesError from "@/components/Notes/NotesError";
import NotesList from "@/components/Notes/NotesList";
import NotesLoading from "@/components/Notes/NotesLoading";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const NotesPage = () => {
  const { notes, isLoading, error } = useNotes();

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <header className="mb-8 flex flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your notes
          </p>
        </div>
        <Button asChild>
          <Link href="/notes/new">
            <Plus />
            New Note
          </Link>
        </Button>
      </header>

      {isLoading && <NotesLoading />}

      {error && <NotesError error={error as Error} />}

      {!isLoading && !error && (!notes || notes.length === 0) && <NotesEmpty />}

      {!isLoading && !error && notes && notes.length > 0 && (
        <NotesList notes={notes} />
      )}
    </div>
  );
};

export default NotesPage;
