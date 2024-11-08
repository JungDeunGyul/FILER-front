import { Dispatch, SetStateAction } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseDeleteFileFolderProps {
  queryClient: QueryClient;
  setDeleteRestoreFileFolderModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface UseDeleteFileFolderParams {
  url: string;
  currentUserRole: string;
}

export const useDeleteFileFolder = ({
  queryClient,
  setDeleteRestoreFileFolderModalOpen,
}: UseDeleteFileFolderProps) => {
  return useMutation({
    mutationFn: async ({ url, currentUserRole }: UseDeleteFileFolderParams) => {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}${url}`, {
        data: {
          currentUserRole,
        },
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
