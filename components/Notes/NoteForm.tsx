"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useCreateNote } from "@/hooks/useCreateNote";
import { useUpdateNote } from "@/hooks/useUpdateNote";
import type Note from "@/types/Note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required")
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  note?: Note;
  onSuccess?: () => void;
}

const NoteForm = ({ note, onSuccess }: Props) => {
  const isEditMode = !!note;

  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote(
    note?.id ?? 0
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? ""
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEditMode) {
      updateNote(data, {
        onSuccess: () => {
          onSuccess?.();
        }
      });
    } else {
      createNote(data, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        }
      });
    }
  };

  const isPending = isCreating || isUpdating;
  const submitButtonText = isEditMode ? "Update Note" : "Create Note";
  const loadingButtonText = isEditMode ? "Updating..." : "Creating...";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter note content"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? loadingButtonText : submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

export default NoteForm;
