import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import { useUploadFile } from "../utils/api/uploadFile";

const DropZone = ({ teamId, userId, folderId, fileId }) => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const queryClient = useQueryClient();
  const uploadFileMutation = useUploadFile(
    queryClient,
    setFiles,
    setUploading,
    setUploadSuccess,
    setErrorMessage,
  );

  const MAX_FILE_SIZE_MB = 30;
  const allowedFileTypes = {
    bmp: "image/bmp",
    csv: "text/csv",
    odt: "application/vnd.oasis.opendocument.text",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    gif: "image/gif",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    pdf: "application/pdf",
    png: "image/png",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    tiff: "image/tiff",
    txt: "text/plain",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    mp4: "video/mp4",
  };

  const onDrop = useCallback((acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) => {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setErrorMessage(
          `파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과합니다: ${file.name}`,
        );
        return false;
      }

      const fileType = file.name.split(".").pop().toLowerCase();
      const fileMimeType = allowedFileTypes[fileType];

      if (fileMimeType !== undefined && file.type === fileMimeType) {
        return true;
      } else {
        setErrorMessage(`${fileType}은 허용되지 않은 파일 형식입니다.`);
        return false;
      }
    });

    setFiles(filteredFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (uploading) {
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    uploadFileMutation.mutate({
      files,
      teamId,
      userId,
      folderId,
      fileId,
    });
  };

  const handleCloseUpload = () => {
    setFiles([]);
    setErrorMessage("");
    setUploading(false);
    setUploadSuccess(false);
  };

  return (
    <div
      className={`dropzone ${
        isDragActive ? "active" : ""
      } border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer`}
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>
          {fileId
            ? "업데이트 할 파일을 넣어주세요"
            : "클릭 혹은 파일을 이곳에 드롭하세요"}
        </p>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {uploadSuccess && (
        <p className="text-green-500 mt-2">
          파일이 성공적으로 업로드 되었습니다.
        </p>
      )}
      {files.length > 0 && (
        <div className="mt-2">
          <ul>
            {files.map((file, index) => (
              <li key={index} className="mb-2">
                <h4>현재 파일:</h4>
                <span>{file.name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <button
              onClick={handleUpload}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={uploading}
            >
              {uploading ? "업로드 중..." : "Upload"}
            </button>
            <button
              onClick={handleCloseUpload}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
