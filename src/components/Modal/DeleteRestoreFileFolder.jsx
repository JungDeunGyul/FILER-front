import useUserStore from "../store/userData";

import axios from "axios";

export function DeleteRestoreFileFolder({
  setDeleteRestoreFileFolderModalOpen,
  selectedElementId,
  selectedType,
  setTrashBin,
  currentUserRole,
}) {
  const { userData, setUserData } = useUserStore();

  const handleDeleteButton = async (event) => {
    event.preventDefault();
    try {
      if (selectedType === "folder") {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_SERVER_URL
          }/trash/folder/${selectedElementId}/delete`,
          { currentUserRole },
        );

        setTrashBin(response.data.trashBin);
        setDeleteRestoreFileFolderModalOpen(false);
      } else if (selectedType === "file") {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_SERVER_URL
          }/trash/file/${selectedElementId}/delete`,
          { currentUserRole },
        );

        setTrashBin(response.data.trashBin);
        setDeleteRestoreFileFolderModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestoreButton = async (event) => {
    event.preventDefault();
    try {
      const userId = userData._id;
      if (selectedType === "folder") {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/restore/folder/${selectedElementId}`,
          { currentUserRole, userId },
        );
        console.log(response.data.user);

        setTrashBin(response.data.trashBin);
        setUserData(response.data.user);
        setDeleteRestoreFileFolderModalOpen(false);
      } else if (selectedType === "file") {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/restore/file/${selectedElementId}`,
          { currentUserRole, userId },
        );

        setTrashBin(response.data.trashBin);
        setUserData(response.data.user);
        setDeleteRestoreFileFolderModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseButton = () => {
    setDeleteRestoreFileFolderModalOpen(false);
  };

  return (
    <div className="fixed w-4/6 h-4/6 z-10 bg-gray flex flex-col items-center justify-center p-4">
      <div className="flex flex-col w-50 rounded-md items-center bg-white p-6">
        <button
          onClick={handleRestoreButton}
          className="rounded-full bg-slate-900 text-white px-4 py-2"
        >
          복구하기
        </button>
        <button
          onClick={handleDeleteButton}
          className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
        >
          삭제하기
        </button>
        <button
          onClick={handleCloseButton}
          className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
