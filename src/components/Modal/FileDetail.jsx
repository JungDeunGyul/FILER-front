import { useState, useEffect, useMemo, useRef } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import UpdateFileDropZone from "../UpdateFileDropZone";
import { handleDownloadFile } from "../../utils/downloadFile";
import useUserStore from "../store/userData";
import axios from "axios";

export function FileDetail({ setFileDetailOpen, file, currentUserRole }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [changedFields, setChangedFields] = useState([]);
  const { userData, setUserData } = useUserStore();
  const commentRef = useRef("");

  const handleModalClick = () => {
    setFileDetailOpen(false);
  };

  useEffect(() => {
    if (selectedFile) {
      const document = (
        <div className="flex">
          <DocViewer
            key={selectedFile.file._id}
            documents={[
              {
                uri: selectedFile.file.filePath,
                fileType: selectedFile.file.type,
              },
            ]}
            prefetchMethod="GET"
            config={{
              header: {
                disableHeader: true,
                disableFileName: true,
                retainURLParams: true,
              },
            }}
            pluginRenderers={DocViewerRenderers}
          />
        </div>
      );
      setSelectedDocument(document);
    } else {
      setSelectedDocument(null);
    }
  }, [selectedFile]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setChangedFields(findChangedFields(selectedFile, file));
    commentRef.current = "";
  };

  const handleCommentChange = (event) => {
    commentRef.current = event.target.value;
  };

  const handleCommentSubmit = async (fileID) => {
    const comment = commentRef.current;
    const userId = userData._id;
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/file/${fileID}/newcomment/${userId}`,
      { comment },
    );

    setUserData(response.data.user);
    commentRef.current = "";
  };

  const MemoizedFirstDocViewer = useMemo(() => {
    if (!file) {
      return null;
    }

    const latestFileVersion = file.versions[file.versions.length - 1];

    return (
      <div className="w-full h-80vh">
        <DocViewer
          documents={[
            {
              uri: latestFileVersion.file.filePath,
              fileType: latestFileVersion.file.type,
            },
          ]}
          prefetchMethod="GET"
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: true,
            },
          }}
          pluginRenderers={DocViewerRenderers}
        />
      </div>
    );
  }, [file]);

  if (!file) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="flex justify-end p-4">
          <div className="text-red-500">파일 접근 권한이 없습니다</div>
        </div>
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={handleModalClick}
        >
          닫기
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const findChangedFields = (prevFile, currentFile) => {
    const changedFields = [];

    if (prevFile && prevFile !== currentFile) {
      changedFields.push(
        `${prevFile.versionNumber} -> ${currentFile.versionNumber} 변경점`,
      );
    }
    if (prevFile && prevFile.file.name !== currentFile.file.name) {
      changedFields.push(`파일 이름: ${currentFile.file.name}`);
    }
    if (prevFile && prevFile.file.size !== currentFile.file.size) {
      changedFields.push(`파일 크기: ${currentFile.file.size}`);
    }
    if (prevFile && prevFile.file.type !== currentFile.file.type) {
      changedFields.push(`파일 타입: ${currentFile.file.type}`);
    }

    return changedFields;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="bg-white w-11/12 md:max-w-4xl mx-auto rounded shadow-lg z-50 overflow-y-auto"
        style={{ width: "90%", maxWidth: "1200px" }}
      >
        <UpdateFileDropZone fileId={file._id} />
        <div className="flex justify-end p-4">
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={handleModalClick}
          >
            닫기
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-4">{MemoizedFirstDocViewer}</div>
          <div className="md:w-1/2 p-4">{selectedDocument}</div>
          <div className="md:w-1/2 p-4 border-l border-gray-200">
            <h2 className="text-lg font-bold mb-4">업데이트 내역</h2>
            <ul className="divide-y divide-gray-200">
              {file.versions
                .slice()
                .reverse()
                .map((version) => (
                  <li
                    key={version._id}
                    onClick={() => handleFileClick(version)}
                    className="py-4 cursor-pointer hover:bg-gray-50 transition duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p
                          className="text-blue-500 font-bold"
                          onClick={() =>
                            handleDownloadFile(
                              version.file.ownerTeam,
                              version.file._id,
                              version.file.name,
                              currentUserRole,
                            )
                          }
                        >
                          다운로드
                        </p>
                        <p className="text-gray-600 text-sm">
                          {formatDate(version.file.created_at)}
                        </p>
                      </div>
                      <p className="text-gray-700">
                        버전 번호: {version.versionNumber}
                      </p>
                    </div>
                    <p className="text-gray-700">
                      업로드 유저: {version.file.uploadUser}
                    </p>
                    {selectedFile &&
                      selectedFile.file._id === version.file._id &&
                      changedFields.map((field) => (
                        <p key={field} className="text-green-500 text-sm">
                          {field} {version.file[field.toLowerCase()]}
                        </p>
                      ))}
                    {selectedFile &&
                      selectedFile.file._id === version.file._id &&
                      version.file.comments.length > 0 && (
                        <div>
                          <h3 className="font-bold mt-2 mb-1">댓글</h3>
                          {version.file.comments.map((comment) => (
                            <div key={comment._id} className="border-t pt-2">
                              <div className="flex justify-between">
                                <p className="text-sm text-gray-500">
                                  {"작성자: "}
                                  {comment.user.nickname}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(comment.created_at)}
                                </p>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    {selectedFile &&
                      selectedFile.file._id === version.file._id && (
                        <div className="mt-2">
                          <textarea
                            className="border rounded p-2 w-full"
                            placeholder="댓글 작성..."
                            ref={commentRef}
                            onChange={handleCommentChange}
                          />
                          <button
                            className="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                              handleCommentSubmit(selectedFile.file._id)
                            }
                          >
                            댓글 작성
                          </button>
                        </div>
                      )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
