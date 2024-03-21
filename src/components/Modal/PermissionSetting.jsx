import { useState } from "react";
import useUserStore from "../store/userData";

import axios from "axios";

export function PermissionSetting({
  setPermissionModalOpen,
  selectedElementId,
  selectedType,
  currentUserRole,
}) {
  const { userData, setUserData } = useUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePermissionSettingButton = async (selectedRole) => {
    if (currentUserRole !== "팀장") {
      setErrorMessage("팀장 이외에는 권한 설정 권한이 없습니다.");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
    }

    const userId = userData._id;

    try {
      if (selectedType === "folder") {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/folder/permission/${selectedElementId}`,
          { currentUserRole, selectedRole, userId },
        );

        if (response.status === 201) {
          setSuccessMessage(response.data.message);
          setTimeout(() => {
            setSuccessMessage("");
            setPermissionModalOpen(false);
            setUserData(response.data.user);
          }, 2000);
        }

        setUserData(response.data.user);
        setPermissionModalOpen(false);
      } else if (selectedType === "file") {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/file/permission/${selectedElementId}`,
          { currentUserRole, selectedRole, userId },
        );

        if (response.status === 201) {
          setSuccessMessage(response.data.message);
          setTimeout(() => {
            setSuccessMessage("");
            setPermissionModalOpen(false);
            setUserData(response.data.user);
          }, 2000);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseButton = () => {
    setPermissionModalOpen(false);
  };

  return (
    <div className="fixed w-4/6 h-4/6 z-10 bg-gray flex flex-col items-center justify-center p-4">
      <div className="flex flex-col w-50 rounded-md items-center bg-white p-6">
        <button
          onClick={() => handlePermissionSettingButton("팀장")}
          className="rounded-full bg-slate-900 text-white px-4 py-2"
        >
          팀장
        </button>
        <button
          onClick={() => handlePermissionSettingButton("팀원")}
          className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
        >
          팀원
        </button>
        <button
          onClick={() => handlePermissionSettingButton("수습")}
          className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
        >
          수습
        </button>
        <button
          onClick={() => handleCloseButton()}
          className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
        >
          취소
        </button>
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        {successMessage && (
          <p className="text-blue-500 mb-2">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
