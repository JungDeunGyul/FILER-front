import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface useSubmitCommentMutationParams {
  fileId: string;
  userId: string;
  comment: string;
}

export const useSubmitComment = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({
      fileId,
      userId,
      comment,
    }: useSubmitCommentMutationParams) => {
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
