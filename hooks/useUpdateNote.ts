import noteService from "@/services/noteService";
import type Note from "@/types/Note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateNoteData = Pick<Note, "title" | "content">;

export const useUpdateNote = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNoteData) => noteService.patch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      toast.success("Note updated successfully!");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to update note. Please try again.";
      toast.error(errorMessage);
    }
  });
};
