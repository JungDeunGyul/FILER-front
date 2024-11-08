import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseLeaveTeamProps {
  queryClient: QueryClient;
  navigate: (path: string) => void;
}

interface UseLeaveTeamMutationProps {
  teamId: string;
  userId: string;
  currentUserRole: string;
}

export const useLeaveTeam = ({ queryClient, navigate }: UseLeaveTeamProps) => {
  return useMutation({
    mutationFn: async ({
      teamId,
      userId,
      currentUserRole,
    }: UseLeaveTeamMutationProps) => {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/team/${teamId}/withdraw/${userId}`,
        {
          data: { currentUserRole },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userData"],
      });

      navigate("/myteam");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
