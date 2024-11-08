import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseMoveFileToFolderMutationProps {
  fileId: string;
  folderId: string;
  userId: string;
  currentUserRole: string;
}

export const useMoveFileToFolder = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({
      fileId,
      folderId,
      userId,
      currentUserRole,
    }: UseMoveFileToFolderMutationProps) => {
      await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/file/${fileId}/move-to-folder/${folderId}`,
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
