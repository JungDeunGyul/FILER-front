import { Dispatch, SetStateAction } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseUpdateFileFolderPermissionProps {
  queryClient: QueryClient;
  setPermissionModalOpen: Dispatch<SetStateAction<boolean>>;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

interface UseUpdateFileFolderPermissionParams {
  url: string;
  currentUserRole: string;
  selectedRole: string;
  userId: string;
}

export const useUpdateFileFolderPermission = ({
  queryClient,
  setPermissionModalOpen,
  setSuccessMessage,
  setErrorMessage,
}: UseUpdateFileFolderPermissionProps) => {
  return useMutation({
    mutationFn: async ({
      url,
      currentUserRole,
      selectedRole,
      userId,
    }: UseUpdateFileFolderPermissionParams) => {
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
      await new Promise<void>((resolve) =>
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
