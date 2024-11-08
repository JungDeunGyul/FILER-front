import { QueryClient, useMutation } from "@tanstack/react-query";

import axios from "axios";

import { Notification } from "userRelatedTypes";

interface UseUpdateNotificationProps {
  queryClient: QueryClient;
}

interface UpdateNotificationParams {
  notification: Notification;
  action?: "수락" | "거절";
  userId: string;
}

export const useUpdateNotification = ({
  queryClient,
}: UseUpdateNotificationProps) => {
  return useMutation({
    mutationFn: async ({
      notification,
      action,
      userId,
    }: UpdateNotificationParams) => {
      const notificationId = notification._id;
      const requestUserId = notification.requestUser;
      const teamName = notification.team?.name;

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
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};
