import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUserStore from "../store/userData";
import axios from "axios";

const DropZone = ({ teamId, userId, folderId, fileId, setFolder }) => {
  const { setUserData } = useUserStore();
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
    try {
      if (uploading) {
        return;
      }

      setUploading(true);
      setUploadSuccess(false);

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file, encodeURIComponent(file.name));
      });

      let response;

      if (fileId) {
        response = await axios.patch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/file/${fileId}/updatefile/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else if (folderId) {
        response = await axios.post(
          `${
            import.meta.env.VITE_SERVER_URL
          }/file/${folderId}/uploadfile/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setFolder(response.data.folder);
      } else if (teamId) {
        response = await axios.post(
          `${
            import.meta.env.VITE_SERVER_URL
          }/team/${teamId}/uploadfile/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      if (response) {
        setUserData(response.data.updatedUser || response.data.user);
        setFiles([]);
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrorMessage("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleCloseUpload = () => {
    setFiles([]);
    setErrorMessage("");
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
