"use client";

import NoteForm from "@/components/Notes/NoteForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const NewNotePage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/notes");
  };

  const handleBack = () => {
    router.push("/notes");
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <header className="mb-8 flex flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Note</h1>
          <p className="text-muted-foreground mt-2">
            Add a new note to your collection
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
          <NoteForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewNotePage;
