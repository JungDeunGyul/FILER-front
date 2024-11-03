import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useSubmitComment = (queryClient) => {
  return useMutation({
    mutationFn: async ({ fileId, userId, comment }) => {
      await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/file/${fileId}/newcomment/${userId}`,
        { comment },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};
