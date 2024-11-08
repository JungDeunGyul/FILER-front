import { Dispatch, SetStateAction } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface UseCreateFolderProps {
  queryClient: QueryClient;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setCreateFolderModalOpen: Dispatch<SetStateAction<boolean>>;
  folderId?: string;
}

interface UseCreateFolderMutationParams {
  folderName: string;
  teamName: string;
  userId: string;
  folderId?: string;
}

export const useCreateFolder = ({
  queryClient,
  setSuccessMessage,
  setErrorMessage,
  setLoading,
  setCreateFolderModalOpen,
  folderId,
}: UseCreateFolderProps) => {
  return useMutation({
    mutationFn: async ({
      folderName,
      teamName,
      userId,
      folderId,
    }: UseCreateFolderMutationParams) => {
      if (folderId) {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/folder/${folderId}/new`,
          { folderName, teamName },
        );
      } else {
        await axios.post(
          `${
            import.meta.env.VITE_SERVER_URL
          }/team/${teamName}/createfolder/${userId}`,
          { folderName },
        );
      }
    },
    onSuccess: async () => {
      setSuccessMessage("성공적으로 폴더가 만들어졌습니다!");

      await new Promise<void>((resolve) =>
        setTimeout(() => {
          setSuccessMessage("");
          setLoading(false);
          resolve();
        }, 3000),
      );
    },
    onError: async (error: AxiosError) => {
      let errorMessage = "알 수 없는 오류가 발생했습니다.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = error.message;
        } else if (error.response.status === 412) {
          errorMessage = error.message;
        }
      }

      setErrorMessage(errorMessage);

      await new Promise<void>((resolve) =>
        setTimeout(() => {
          setErrorMessage("");
          setLoading(false);
          resolve();
        }, 3000),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userData"],
      });

      if (folderId) {
        await queryClient.invalidateQueries({
          queryKey: ["folderData", folderId],
        });
      }

      setCreateFolderModalOpen(false);
    },
  });
};
