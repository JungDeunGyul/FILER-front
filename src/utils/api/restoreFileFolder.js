import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useRestoreFileFolder = (
  queryClient,
  setDeleteRestoreFileFolderModalOpen,
) => {
  return useMutation({
    mutationFn: async ({ url, currentUserRole, userId }) => {
      await axios.patch(`${import.meta.env.VITE_SERVER_URL}${url}`, {
        currentUserRole,
        userId,
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
    onError: (error) => {
      console.error(error);
    },
    onSettled: () => {
      setDeleteRestoreFileFolderModalOpen(false);
    },
  });
};
