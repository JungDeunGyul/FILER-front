import React, { useState, useRef } from "react";
import { useCreateFolder } from "../../utils/api/createFolder";

export function CreateFolder({
  setCreateFolderModalOpen,
  teamName,
  queryClient,
  userData,
  folderId,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const createFolderMutation = useCreateFolder(
    queryClient,
    setSuccessMessage,
    setErrorMessage,
    setLoading,
    setCreateFolderModalOpen,
    folderId,
  );

  const createInputRef = useRef(null);

  const handleCloseModals = () => {
    setCreateFolderModalOpen(false);
  };

  const handleChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const userId = userData._id;
    const folderName = createInputRef.current.value;

    if (
      folderName.length < 3 ||
      folderName.length > 10 ||
      /[!@#$%^&*(),.?":{}|<>]/.test(folderName)
    ) {
      setErrorMessage(
        "폴더 이름은 3자 이상, 10자 이하이며 특수문자를 포함할 수 없습니다.",
      );

      setLoading(false);
      return;
    }

    createFolderMutation.mutate({ folderName, teamName, userId, folderId });

    return;
  };

  return (
    <div className="fixed w-4/6 h-4/6 z-10 bg-gray flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-50 rounded-md items-center bg-white p-6">
          <label className="text-2xl font-bold mb-4">
            폴더 이름을 입력해주세요
          </label>
          <input
            ref={createInputRef}
            onChange={handleChange}
            className="border rounded-md p-3 mb-4 w-full"
            disabled={loading}
          />
          <div className={`mb-10 h-32 overflow-hidden`}>
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-blue-500 mb-2">{successMessage}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-full bg-slate-900 text-white px-4 py-2"
            disabled={loading}
          >
            {loading ? "폴더 생성중..." : "폴더 생성하기"}
          </button>
          <button
            onClick={handleCloseModals}
            className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
