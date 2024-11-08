import { useMemo } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import type { OwnedFiles } from "userRelatedTypes";

interface DocViewerWrapperProps {
  file: OwnedFiles;
}

export const DocViewerWrapper = ({ file }: DocViewerWrapperProps) => {
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
    <div>
      <DocViewer
        {...docViewerProps}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "208px",
        }}
      />
    </div>
  );
};
