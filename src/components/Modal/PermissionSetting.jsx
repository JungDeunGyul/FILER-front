import React, { useState } from "react";
import useUserStore from "../store/userData";
import axios from "axios";

export function PermissionSetting({
  setPermissionModalOpen,
  selectedElementId,
  selectedType,
  currentUserRole,
  clickPosition,
}) {
  const { userData, setUserData } = useUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePermissionSettingButton = async (event, selectedRole) => {
    event.preventDefault();

    if (currentUserRole !== "팀장") {
      setErrorMessage("팀장 이외에는 권한 설정 권한이 없습니다.");
      return setTimeout(() => {
        setErrorMessage("");
        handleCloseButton();
      }, 2000);
    }

    const userId = userData._id;
    const url =
      selectedType === "folder"
        ? `/folder/permission/${selectedElementId}`
        : `/file/permission/${selectedElementId}`;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}${url}`,
        { currentUserRole, selectedRole, userId },
      );

      const { status, data } = response;

      if (status === 201) {
        setSuccessMessage(data.message);
        setUserData(data.user);
      } else {
        setErrorMessage(data.message);
      }

      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setPermissionModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseButton = () => {
    setPermissionModalOpen(false);
  };

  return (
    <div
      className="fixed"
      style={{
        top: `${clickPosition.y}px`,
        left: `${clickPosition.x}px`,
      }}
    >
      <div className="bg-white bg-opacity-40 rounded-md p-6 ">
        <button
          onClick={(event) => handlePermissionSettingButton(event, "팀장")}
          className="block py-2 px-4 text-gray-800 bg-gray-200 rounded-md mb-2"
        >
          팀장
        </button>
        <button
          onClick={(event) => handlePermissionSettingButton(event, "팀원")}
          className="block py-2 px-4 text-gray-800 bg-gray-200 rounded-md mb-2"
        >
          팀원
        </button>
        <button
          onClick={(event) => handlePermissionSettingButton(event, "수습")}
          className="block py-2 px-4 text-gray-800 bg-gray-200 rounded-md mb-2"
        >
          수습
        </button>
        <button
          onClick={handleCloseButton}
          className="block py-2 px-4 text-white bg-gray-500 rounded-md"
        >
          취소
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {successMessage && (
          <p className="text-blue-500 mt-2">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
