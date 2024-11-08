import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseMoveFolderToTrashMutationProps {
  folderId: string;
  userId: string;
  currentUserRole: string;
}

export const useMoveFolderToTrash = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({
      folderId,
      userId,
      currentUserRole,
    }: UseMoveFolderToTrashMutationProps) => {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/trash/folder/${folderId}/`,
        { userId, currentUserRole },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userData"],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
