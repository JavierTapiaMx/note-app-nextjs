import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import noteService from "@/services/noteService";
import { toast } from "sonner";

export const useNotes = () => {
  const queryClient = useQueryClient();

  const {
    data: notes,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["notes"],
    queryFn: () => noteService.getAll(),
    // Data remains fresh for 5 minutes, preventing unnecessary refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Cached data is kept in memory for 10 minutes after last usage
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    // Retry failed requests up to 3 times with exponential backoff
    retry: 3,
    // Automatically refetch when window regains focus to ensure data freshness
    refetchOnWindowFocus: true,
    // Refetch when network reconnects after being offline
    refetchOnReconnect: true
  });

  const deleteMutation = useMutation({
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

  return {
    notes,
    isLoading,
    isFetching,
    error,
    refetch,
    deleteNote: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
};
