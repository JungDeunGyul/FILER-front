import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateNotification = (queryClient) => {
  return useMutation({
    mutationFn: async ({ notification, action, userId }) => {
      const notificationId = notification._id;
      const requestUserId = notification.requestUser;
      const teamName = notification.team.name;

      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/notification/${notificationId}`,
      );

      await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/team/${teamName}/joinrequest/${userId}`,
        { action, requestUserId },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userData"]);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};
