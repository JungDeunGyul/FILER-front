import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteFileFolder = (
  queryClient,
  setDeleteRestoreFileFolderModalOpen,
) => {
  return useMutation({
    mutationFn: async ({ url, currentUserRole }) => {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}${url}`, {
        currentUserRole,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["trashBin"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["userData"],
      });
    },
    onSettled: () => {
      setDeleteRestoreFileFolderModalOpen(false);
    },
  });
};
