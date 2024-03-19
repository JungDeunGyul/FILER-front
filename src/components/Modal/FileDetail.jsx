import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

export function FileDetail({ setFileDetailOpen, file }) {
  const docs = [
    {
      uri: file.filePath,
      fileType: file.type,
      filePath: file.name,
    },
  ];

  const handleModalClick = () => {
    setFileDetailOpen(false);
  };

  return (
    <div>
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
