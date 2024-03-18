import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useUserStore from "../store/userData";
import axios from "axios";

const DropZone = ({ teamId, userId, folderId, setFolder }) => {
  const { setUserData } = useUserStore();
  const [files, setFiles] = useState([]);
  const [renamingFile, setRenamingFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRename = (index, newName) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = {
        ...updatedFiles[index],
        name: newName,
      };

      return updatedFiles;
    });

    setRenamingFile(null);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
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
    <div className={`dropzone ${isDragActive ? "active" : ""} `}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>클릭 혹은 파일을 이곳에 드롭하세요</p>
      </div>

      {files.length > 0 && (
        <div>
          <h4>현재 파일:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {renamingFile === index ? (
                  <div>
                    <input
                      type="text"
                      value={file.name}
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = {
                          ...file,
                          name: e.target.value,
                        };
                        setFiles(updatedFiles);
                      }}
                    />
                    <button onClick={() => handleRename(index, file.name)}>
                      업로드하기
                    </button>
                  </div>
                ) : (
                  <div>
                    <span>{file.name}</span>
                    <button onClick={() => setRenamingFile(index)}>
                      이름 변경
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button onClick={handleUpload}>Upload</button>
          <button onClick={handleCloseUpload}>Close</button>
        </div>
      )}
    </div>
  );
};

export default DropZone;
