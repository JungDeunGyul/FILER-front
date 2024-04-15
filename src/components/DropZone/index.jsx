import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUserStore from "../store/userData";
import axios from "axios";

const DropZone = ({ teamId, userId, folderId, setFolder }) => {
  const { setUserData } = useUserStore();
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file, encodeURIComponent(file.name));
      });

      if (folderId) {
        const response = await axios.post(
          `${
            import.meta.env.VITE_SERVER_URL
          }/file/${folderId}/uploadfile/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              files,
            },
          },
        );

        setFolder(response.data.folder);
        setFiles([]);

        return;
      }

      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/team/${teamId}/uploadfile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            files,
          },
        },
      );

      setUserData(response.data.updatedUser);
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
        <p>클릭 혹은 파일을 이곳에 드롭하세요</p>
      </div>
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

export default DropZone;
