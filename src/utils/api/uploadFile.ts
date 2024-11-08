import { Dispatch, SetStateAction } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

import type { File } from "fileTypes";

interface UseUploadFileProps {
  queryClient: QueryClient;
  setFile: Dispatch<SetStateAction<File | null>>;
  setUploading: Dispatch<SetStateAction<boolean>>;
  setUploadSuccess: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

interface UploadFileMutationParams {
  file: File;
  teamId?: string;
  userId: string;
  folderId?: string;
  fileId?: string;
}

interface UploadFileResponse {
  fileId?: string;
  folderId?: string;
}

export const useUploadFile = ({
  queryClient,
  setFile,
  setUploading,
  setUploadSuccess,
  setErrorMessage,
}: UseUploadFileProps) => {
  return useMutation<UploadFileResponse, Error, UploadFileMutationParams>({
    mutationFn: async ({
      file,
      teamId,
      userId,
      folderId,
      fileId,
    }: UploadFileMutationParams) => {
      if (!file) {
        throw new Error("업로드할 파일이 없습니다.");
      }

      const formData = new FormData();

      formData.append("file", file, encodeURIComponent(file.name));

      const SERVER_URL = import.meta.env.VITE_SERVER_URL;

      if (fileId) {
        await axios.patch(
          `${SERVER_URL}/file/${fileId}/updatefile/${userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else if (folderId) {
        await axios.post(
          `${SERVER_URL}/file/${folderId}/uploadfile/${userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else if (teamId) {
        await axios.post(
          `${SERVER_URL}/team/${teamId}/uploadfile/${userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      return { fileId, folderId };
    },
    onSuccess: async () => {
      setFile(null);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 2000);
    },
    onError: async () => {
      setErrorMessage("파일 업로드 중 오류가 발생했습니다.");

      await new Promise<void>((resolve) =>
        setTimeout(() => {
          setErrorMessage("");
          resolve();
        }, 2000),
      );
    },
    onSettled: async (data: UploadFileResponse | undefined) => {
      if (data) {
        const { folderId } = data;

        await queryClient.invalidateQueries({ queryKey: ["userData"] });

        if (folderId) {
          await queryClient.invalidateQueries({
            queryKey: ["folderData", folderId],
          });
        }
      }

      setUploading(false);
    },
  });
};
