import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useMoveFileToFolder = (queryClient) => {
  return useMutation({
    mutationFn: async ({ fileId, folderId, userId, currentUserRole }) => {
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
