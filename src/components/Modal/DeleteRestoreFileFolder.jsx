import { useQueryClient } from "@tanstack/react-query";
import { useDeleteFileFolder } from "../../utils/api/deleteFileFolder";
import { useRestoreFileFolder } from "../../utils/api/restoreFileFolder";

export function DeleteRestoreFileFolder({
  setDeleteRestoreFileFolderModalOpen,
  selectedElementId,
  selectedType,
  currentUserRole,
  userId,
}) {
  const queryClient = useQueryClient();
  const deleteFilerFolderMutation = useDeleteFileFolder(
    queryClient,
    setDeleteRestoreFileFolderModalOpen,
  );
  const restoreFileFolderMutation = useRestoreFileFolder(
    queryClient,
    setDeleteRestoreFileFolderModalOpen,
  );

  const handleDeleteButton = (event) => {
    event.preventDefault();

    const url =
      selectedType === "folder"
        ? `/trash/folder/${selectedElementId}/delete`
        : `/trash/file/${selectedElementId}/delete`;

    deleteFilerFolderMutation.mutate({ url, currentUserRole });
  };

  const handleRestoreButton = (event) => {
    event.preventDefault();

    const url =
      selectedType === "folder"
        ? `/restore/folder/${selectedElementId}`
        : `/restore/file/${selectedElementId}`;

    restoreFileFolderMutation.mutate({
      url,
      currentUserRole,
      userId,
    });
  };

  const handleCloseButton = () => {
    setDeleteRestoreFileFolderModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center">파일/폴더 관리</h2>
        <p className="text-center text-gray-600">
          선택한 항목을 복구하거나 삭제할 수 있습니다.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleRestoreButton}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            복구하기
          </button>
          <button
            onClick={handleDeleteButton}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            삭제하기
          </button>
          <button
            onClick={handleCloseButton}
            className="w-full py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}
