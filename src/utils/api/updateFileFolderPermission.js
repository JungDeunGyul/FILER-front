import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateFileFolderPermission = (
  queryClient,
  setPermissionModalOpen,
  setSuccessMessage,
  setErrorMessage,
) => {
  return useMutation({
    mutationFn: async ({ url, currentUserRole, selectedRole, userId }) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}${url}`,
        { currentUserRole, selectedRole, userId },
      );

      return response.data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
    onSettled: async () => {
      await new Promise((resolve) =>
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
          resolve();
        }, 3000),
      );

      await queryClient.invalidateQueries({ queryKey: ["userData"] });

      setPermissionModalOpen(false);
    },
  });
};
