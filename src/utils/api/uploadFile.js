import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUploadFile = (
  queryClient,
  setFiles,
  setUploading,
  setUploadSuccess,
  setErrorMessage,
) => {
  return useMutation({
    mutationFn: async ({ files, teamId, userId, folderId, fileId }) => {
      if (!files || files.length === 0) {
        throw new Error("업로드할 파일이 없습니다.");
      }

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file, encodeURIComponent(file.name));
      });

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
      setFiles([]);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 2000);
    },
    onError: async () => {
      setErrorMessage("파일 업로드 중 오류가 발생했습니다.");

      await new Promise((resolve) =>
        setTimeout(() => {
          setErrorMessage("");
          resolve();
        }, 2000),
      );
    },
    onSettled: async (data) => {
      const { folderId } = data;

      await queryClient.invalidateQueries({ queryKey: ["userData"] });

      if (folderId) {
        await queryClient.invalidateQueries({
          queryKey: ["folderData", folderId],
        });
      }

      setUploading(false);
    },
  });
};
