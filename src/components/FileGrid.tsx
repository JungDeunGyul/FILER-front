import { DocViewerWrapper } from "@utils/docViewerWrapper";
import { getFileIconUrl } from "@utils/fileIconURL";

import type { OwnedFiles } from "userRelatedTypes";

interface FileGridProps {
  filteredFiles: OwnedFiles[];
  handleFileDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    fileId: string,
  ) => void;
  handleFileClick: (file: OwnedFiles) => void;
  selectedFile: OwnedFiles | null;
  handleDownloadFile: (params: {
    teamId: string;
    fileId: string;
    fileName: string;
    currentUserRole: string;
  }) => void;
  handleViewDetails: (file: OwnedFiles) => void;
  handlePermissionClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    fileId: string,
    type: string,
  ) => void;
  handleCancel: () => void;
  teamId: string;
  currentUserRole: string;
}

const FileGrid = ({
  filteredFiles,
  handleFileDragStart,
  handleFileClick,
  selectedFile,
  handleDownloadFile,
  handleViewDetails,
  handlePermissionClick,
  handleCancel,
  teamId,
  currentUserRole,
}: FileGridProps) => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {filteredFiles.map((file: OwnedFiles) => (
        <div
          role="file"
          key={file._id}
          draggable="true"
          onDragStart={(event) => handleFileDragStart(event, file._id)}
          className="group relative cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:scale-105 bg-white aspect-[1/1]"
        >
          <div
            className="h-full p-4 overflow-hidden"
            onClick={() => handleFileClick(file)}
          >
            <img src={getFileIconUrl(file.type)} alt={file.type} />
            <span className="text-gray-600 block text-lg font-medium truncate">
              {file.name.length > 20
                ? `${file.name.substring(0, 20)}...`
                : file.name}
            </span>
            <DocViewerWrapper file={file} />
          </div>
          {selectedFile && selectedFile._id === file._id && (
            <div className="absolute top-0 right-0 flex flex-col items-end space-y-2 p-2 bg-white rounded-lg shadow-lg">
              <button
                onClick={() =>
                  handleDownloadFile({
                    teamId,
                    fileId: file._id,
                    fileName: file.name,
                    currentUserRole,
                  })
                }
                className="text-sm text-blue-600 hover:underline"
              >
                다운로드
              </button>
              <button
                onClick={() => handleViewDetails(file)}
                className="text-sm text-blue-600 hover:underline"
              >
                자세히 보기
              </button>
              <button
                onClick={(event) =>
                  handlePermissionClick(event, file._id, "file")
                }
                className="text-sm text-blue-600 hover:underline"
              >
                권한 설정
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-blue-600 hover:underline"
              >
                취소
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default FileGrid;
