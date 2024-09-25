import { DocViewerWrapper } from "../../utils/docViewerWrapper";
import { getFileIconUrl } from "../../utils/fileIconURL";

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
}) => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {filteredFiles.map((file) => (
        <div
          role="file"
          key={file._id}
          draggable="true"
          onDragStart={(event) => handleFileDragStart(event, file._id)}
          className="group relative cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:scale-105 bg-white"
        >
          <div onClick={() => handleFileClick(file._id)}>
            <img
              src={getFileIconUrl(file.type)}
              alt={file.type}
              className="w-12 h-12 mb-2 transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-gray-600 block text-lg font-medium truncate">
              {file.name.length > 20
                ? `${file.name.substring(0, 20)}...`
                : file.name}
            </span>
            <DocViewerWrapper file={file} />
          </div>
          {selectedFile === file._id && (
            <div className="absolute top-0 right-0 flex flex-col items-end space-y-2 p-2 bg-white rounded-lg shadow-lg">
              <button
                onClick={() =>
                  handleDownloadFile(
                    teamId,
                    file._id,
                    file.name,
                    currentUserRole,
                  )
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
