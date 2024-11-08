import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface useMoveFileToTrashMutationProps {
  fileId: string;
  userId: string;
  currentUserRole: string;
}

export const useMoveFileToTrash = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({
      fileId,
      userId,
      currentUserRole,
    }: useMoveFileToTrashMutationProps) => {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/trash/file/${fileId}/`,
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
