import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useMoveFolderToTrash = (queryClient) => {
  return useMutation({
    mutationFn: async ({ folderId, userId, currentUserRole }) => {
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
