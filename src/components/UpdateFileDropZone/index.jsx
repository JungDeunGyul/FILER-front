import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUserStore from "../store/userData";
import axios from "axios";

const UpdateFileDropZone = ({ fileId }) => {
  const { userData, setUserData } = useUserStore();
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
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
