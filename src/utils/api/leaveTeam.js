import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLeaveTeam = (queryClient, navigate) => {
  return useMutation({
    mutationFn: async ({ teamId, userId, currentUserRole }) => {
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
