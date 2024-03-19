import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

export function FileDetail({ setFileDetailOpen, file }) {
  const docs = [
    {
      uri: file.filePath,
      fileType: file.type,
    },
  ];

  const handleModalClick = () => {
    setFileDetailOpen(false);
  };

  return (
    <div className="fixed w-4/6 h-4/6 z-10 bg-gray flex flex-col items-center justify-center p-4">
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
      <div onClick={handleModalClick}>닫기</div>
    </div>
  );
}
