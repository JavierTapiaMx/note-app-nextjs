import noteService from "@/services/noteService";
import type Note from "@/types/Note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateNoteData = Pick<Note, "title" | "content">;

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteData) => noteService.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully!");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to create note. Please try again.";
      toast.error(errorMessage);
    }
  });
};
