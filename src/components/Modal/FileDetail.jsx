import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

export function FileDetail({ setFileDetailOpen, file }) {
  const docs = [];

  if (file) {
    docs.push({
      uri: file.filePath,
      fileType: file.type,
    });
  }

  const handleModalClick = () => {
    setFileDetailOpen(false);
  };

  return (
    <div className="fixed w-full h-full z-10 bg-gray flex flex-col items-center justify-center p-4">
      {file ? (
        <DocViewer
          documents={docs}
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
      ) : (
        <div className="text-red-500">파일 접근 권한이 없습니다</div>
      )}
      <div onClick={handleModalClick}>닫기</div>
    </div>
  );
}
