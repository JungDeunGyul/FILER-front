import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateNotification } from "@api/updateNotification";
import { useEventSource } from "@api/eventSource";

import type { User, Notification } from "userRelatedTypes";
type Action = "수락" | "거절" | undefined;

function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<User>(["userData"]);
  const iconURI = userData!.iconpath;
  const loginUserId = userData!._id;

  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const handleUpdateNotification = useUpdateNotification({ queryClient });

  useEventSource({ queryClient, loginUserId });

  const handleAcceptReject = (notification: Notification, action?: Action) => {
    handleUpdateNotification.mutate({
      notification,
      action: action || undefined,
      userId: loginUserId,
    });

    queryClient.invalidateQueries({ queryKey: ["userData"] });
  };

  const handleIconClick = () => {
    setNotificationOpen((prevState) => !prevState);
  };

  return (
    <header className="flex justify-between items-center bg-gray-800 text-white py-4 px-8">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src="/FilerLoGo.png" className="h-10 w-10" alt="Filer Logo" />
        <h1 className="ml-4 text-lg font-semibold">Filer</h1>
      </div>
      <div className="relative">
        <img
          src={iconURI}
          onClick={handleIconClick}
          alt="User Icon"
          className="rounded-full h-10 w-10 cursor-pointer"
        />
        {userData!.notifications?.filter(
          (notification) => !notification?.isRead,
        ).length > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex justify-center items-center">
            {
              userData!.notifications.filter(
                (notification) => !notification?.isRead,
              ).length
            }
          </div>
        )}
        {isNotificationOpen && (
          <div className="absolute right-0 mt-12 w-80 bg-white border border-gray-200 shadow-lg text-gray-700 rounded-lg p-4 z-10">
            {userData!.notifications?.map(
              (notification) =>
                !notification.isRead && (
                  <div key={notification._id} className="mb-4">
                    <p className="text-sm">{notification.content}</p>
                    {notification.type === "가입요청" ? (
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() =>
                            handleAcceptReject(notification, "수락")
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          수락
                        </button>
                        <button
                          onClick={() =>
                            handleAcceptReject(notification, "거절")
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          거절
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcceptReject(notification)}
                        className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        확인
                      </button>
                    )}
                  </div>
                ),
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
