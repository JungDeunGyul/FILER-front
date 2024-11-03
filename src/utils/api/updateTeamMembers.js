import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateTeamMembers = (
  queryClient,
  setErrorMessage,
  setSuccessMessage,
  setManageTeamMemberModalOpen,
) => {
  return useMutation({
    mutationFn: async ({
      selectedMemberId,
      currentUserRole,
      selectedRole,
      teamId,
      userId,
    }) => {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/team/${selectedMemberId}/manageteam/`,
        { currentUserRole, selectedRole, teamId, userId },
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

      setManageTeamMemberModalOpen(false);
    },
  });
};
