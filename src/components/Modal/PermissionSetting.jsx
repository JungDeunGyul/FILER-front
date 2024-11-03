import React, { useState } from "react";

import { useUpdateFileFolderPermission } from "../../utils/api/updateFileFolderPermission";

export function PermissionSetting({
  setPermissionModalOpen,
  selectedElementId,
  selectedType,
  currentUserRole,
  clickPosition,
  queryClient,
  userData,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateFileFolderPermissionMutation = useUpdateFileFolderPermission(
    queryClient,
    setPermissionModalOpen,
    setSuccessMessage,
    setErrorMessage,
  );

  const handlePermissionSettingButton = (event, selectedRole) => {
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

    updateFileFolderPermissionMutation.mutate({
      url,
      currentUserRole,
      selectedRole,
      userId,
    });
  };

  const handleCloseButton = () => {
    setPermissionModalOpen(false);
  };

  return (
    <div
      className="fixed z-50"
      style={{
        top: `${clickPosition.y}px`,
        left: `${clickPosition.x}px`,
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4 transform transition-all duration-200">
        <button
          onClick={(event) => handlePermissionSettingButton(event, "팀장")}
          className="w-full py-2 px-4 text-gray-800 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200"
        >
          팀장
        </button>
        <button
          onClick={(event) => handlePermissionSettingButton(event, "팀원")}
          className="w-full py-2 px-4 text-gray-800 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200"
        >
          팀원
        </button>
        <button
          onClick={(event) => handlePermissionSettingButton(event, "수습")}
          className="w-full py-2 px-4 text-gray-800 bg-blue-100 rounded-md hover:bg-blue-200 transition duration-200"
        >
          수습
        </button>
        <button
          onClick={handleCloseButton}
          className="w-full py-2 px-4 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-200"
        >
          취소
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mt-2">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
