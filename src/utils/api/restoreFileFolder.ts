import { Dispatch, SetStateAction } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseRestoreFileFolderProps {
  queryClient: QueryClient;
  setDeleteRestoreFileFolderModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface UseRestoreFileFolderParams {
  url: string;
  currentUserRole: string;
  userId: string;
}

export const useRestoreFileFolder = ({
  queryClient,
  setDeleteRestoreFileFolderModalOpen,
}: UseRestoreFileFolderProps) => {
  return useMutation({
    mutationFn: async ({
      url,
      currentUserRole,
      userId,
    }: UseRestoreFileFolderParams) => {
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
