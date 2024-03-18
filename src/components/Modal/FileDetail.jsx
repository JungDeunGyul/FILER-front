import DocViewer from "react-doc-viewer";

export function FileDetail({ setFileDetailOpen, filePath }) {
  const docs = [
    {
      uri: filePath,
    },
  ];

  const handleModalClick = () => {
    setFileDetailOpen(false);
  };

  return (
    <div>
      <DocViewer
        documents={docs}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
            retainURLParams: true,
          },
        }}
      />
      <div onClick={handleModalClick}>hi</div>
    </div>
  );
}
