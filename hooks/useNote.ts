import { useQuery } from "@tanstack/react-query";
import noteService from "@/services/noteService";

export const useNote = (id: number) => {
  const {
    data: note,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => noteService.get(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  return {
    note,
    isLoading,
    error,
    refetch
  };
};
