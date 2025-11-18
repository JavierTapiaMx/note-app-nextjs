"use client";

import { useParams, useRouter } from "next/navigation";
import NoteForm from "@/components/Notes/NoteForm";
import NotesLoading from "@/components/Notes/NotesLoading";
import NotesError from "@/components/Notes/NotesError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNote } from "@/hooks/useNote";

const EditNotePage = () => {
  const params = useParams();
  const router = useRouter();
  const noteId = parseInt(params.id as string);

  const { note, isLoading, error } = useNote(noteId);

  const handleSuccess = () => {
    router.push("/notes");
  };

  const handleBack = () => {
    router.push("/notes");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <NotesLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <NotesError error={error as Error} />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <NotesError error={new Error("Note not found")} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <header className="mb-8 flex flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Note</h1>
          <p className="text-muted-foreground mt-2">
            Update your note details
          </p>
        </div>
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft />
          Back to Notes
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <NoteForm note={note} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditNotePage;
