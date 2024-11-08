import { Dispatch, SetStateAction } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface useUpdateTeamMembersProps {
  queryClient: QueryClient;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  setManageTeamMemberModalOpen: Dispatch<SetStateAction<boolean>>;
}

interface useUpdateTeamMembersMutationParams {
  selectedMemberId: string;
  currentUserRole: string;
  selectedRole: string;
  teamId: string;
  userId: string;
}

export const useUpdateTeamMembers = ({
  queryClient,
  setErrorMessage,
  setSuccessMessage,
  setManageTeamMemberModalOpen,
}: useUpdateTeamMembersProps) => {
  return useMutation({
    mutationFn: async ({
      selectedMemberId,
      currentUserRole,
      selectedRole,
      teamId,
      userId,
    }: useUpdateTeamMembersMutationParams) => {
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
      await new Promise<void>((resolve) =>
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
