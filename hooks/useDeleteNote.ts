import { useMutation, useQueryClient } from "@tanstack/react-query";
import noteService from "@/services/noteService";
import { toast } from "sonner";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully!");
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || "Failed to delete note. Please try again.";
      toast.error(errorMessage);
    }
  });
};
