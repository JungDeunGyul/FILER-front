import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useMoveFileToTrash = (queryClient) => {
  return useMutation({
    mutationFn: async ({ fileId, userId, currentUserRole }) => {
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
