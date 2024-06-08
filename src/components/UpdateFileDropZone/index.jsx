import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUserStore from "../store/userData";
import axios from "axios";

const UpdateFileDropZone = ({ fileId }) => {
  const { userData, setUserData } = useUserStore();
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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
      const userId = userData._id;
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file, encodeURIComponent(file.name));
      });

      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/file/${fileId}/updatefile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            files,
          },
        },
      );

      setUserData(response.data.user);
      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleCloseUpload = () => {
    setFiles([]);
  };

  return (
    <div
      className={`dropzone ${
        isDragActive ? "active" : ""
      } border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer`}
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>업데이트 할 파일을 넣어주세요</p>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
            >
              Upload
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

export default UpdateFileDropZone;
