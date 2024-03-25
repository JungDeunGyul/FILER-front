import { useState, useEffect } from "react";
import useUserStore from "../store/userData";

import axios from "axios";

function Header() {
  const { userData, setUserData } = useUserStore();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const iconURI = userData.iconpath;

  useEffect(() => {
    const loginUserId = userData._id;

    const source = new EventSource(
      `${import.meta.env.VITE_SERVER_URL}/team/filer-stream/${loginUserId}`,
    );

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.userData);
      setUserData(data.userData);
    };

    return () => {
      if (source) {
        source.close();
      }
    };
  }, [userData]);

  const handleAcceptReject = async (notification, action) => {
    const teamName = notification.team.name;
    const requestUserId = notification.requestUser;

    await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}/notification/${notification._id}`,
    );

    const response = await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}/team/${teamName}/joinrequest/${
        userData._id
      }`,
      { action, requestUserId },
    );

    setUserData(response.data.userData);
  };

  const handleIconClick = () => {
    if (isNotificationOpen === true) {
      setNotificationOpen(false);
    } else {
      setNotificationOpen(true);
    }
  };

  return (
    <div className="flex">
      <div className="text-5xl mt-2 ml-2">FILER :</div>
      <img
        src={iconURI}
        onClick={handleIconClick}
        alt="userIcon"
        className="flex mt-2 rounded-full h-10 w-10"
      />
      <div>
        {
          userData.notifications.filter((notification) => !notification.isRead)
            .length
        }
      </div>
      <div>
        {isNotificationOpen &&
          userData.notifications.map(
            (notification) =>
              !notification.isRead && (
                <div key={notification._id}>
                  <p>{notification.content}</p>
                  {notification.type === "가입요청" ? (
                    <>
                      <button
                        onClick={() => handleAcceptReject(notification, "수락")}
                      >
                        수락
                      </button>
                      <button
                        onClick={() => handleAcceptReject(notification, "거절")}
                      >
                        거절
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleAcceptReject(notification)}>
                      확인
                    </button>
                  )}
                </div>
              ),
          )}
      </div>
    </div>
  );
}

export default Header;
