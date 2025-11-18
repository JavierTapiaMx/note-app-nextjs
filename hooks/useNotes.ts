import { useQuery } from "@tanstack/react-query";
import noteService from "@/services/noteService";

export const useNotes = () => {
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

  return {
    notes,
    isLoading,
    isFetching, // Useful to show background refresh indicators
    error,
    refetch
  };
};
