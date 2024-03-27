import { useState, useEffect, useMemo } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import UpdateFileDropZone from "../UpdateFileDropZone";
import { handleDownloadFile } from "../../utils/downloadFile";

export function FileDetail({ setFileDetailOpen, file, currentUserRole }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [changedFields, setChangedFields] = useState([]);

  const handleModalClick = () => {
    setFileDetailOpen(false);
  };

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.file.type === "application/pdf") {
        const document = (
          <iframe
            src={selectedFile.file.filePath}
            style={{ width: "100%", height: "800px" }}
          ></iframe>
        );
        setSelectedDocument(document);
      } else {
        const document = (
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
        );
        setSelectedDocument(document);
      }
    } else {
      setSelectedDocument(null);
    }
  }, [selectedFile]);

  const MemoizedFirstDocViewer = useMemo(() => {
    if (
      file.versions[file.versions.length - 1].file.type === "application/pdf"
    ) {
      return (
        <iframe
          src={file.versions[file.versions.length - 1].file.filePath}
          style={{ width: "100%", height: "800px" }}
        ></iframe>
      );
    }

    return (
      <DocViewer
        documents={[
          {
            uri: file.versions[file.versions.length - 1].file.filePath,
            fileType: file.versions[file.versions.length - 1].file.type,
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

  const handleFileClick = (file) => {
    setSelectedFile(file);

    setChangedFields(findChangedFields(selectedFile, file));
  };

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
            <h2 className="text-lg font-bold mb-2">업데이트 내역</h2>
            <ul className="overflow-auto max-h-96">
              {file.versions
                .slice()
                .reverse()
                .map((version) => (
                  <li
                    key={version._id}
                    onClick={() => handleFileClick(version)}
                    className="mb-2 border"
                  >
                    <p
                      onClick={() =>
                        handleDownloadFile(
                          version.ownerTeam,
                          version._id,
                          version.name,
                          currentUserRole,
                        )
                      }
                    >
                      다운로드
                    </p>
                    <p>버전 번호: {version.versionNumber}</p>
                    <p>업로드 유저: {version.file.uploadUser}</p>
                    <p>업로드 날짜: {formatDate(version.file.created_at)}</p>
                    {selectedFile &&
                      selectedFile.file._id === version.file._id &&
                      changedFields.map((field) => (
                        <p key={field} className="font-bold">
                          {console.log(field)}
                          {field} {version.file[field.toLowerCase()]}
                        </p>
                      ))}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
