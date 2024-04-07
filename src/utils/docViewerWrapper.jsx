import { useMemo } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export const DocViewerWrapper = ({ file }) => {
  const docViewerProps = useMemo(
    () => ({
      documents: [
        {
          uri: file.filePath,
          fileType: file.type,
        },
      ],
      prefetchMethod: "GET",
      config: {
        header: {
          disableHeader: true,
          disableFileName: true,
          retainURLParams: true,
        },
      },
      pluginRenderers: DocViewerRenderers,
    }),
    [file.filePath, file.type],
  );

  return (
    <div style={{ width: "270px", height: "200px" }}>
      <DocViewer {...docViewerProps} />
    </div>
  );
};
