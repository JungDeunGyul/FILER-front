import axios from "axios";

interface handleDownloadFileParams {
  teamId: string;
  fileId: string;
  fileName: string;
  currentUserRole: string;
}

export const handleDownloadFile = async ({
  teamId,
  fileId,
  fileName,
  currentUserRole,
}: handleDownloadFileParams) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/team/${teamId}/file/${fileId}?currentUserRole=${currentUserRole}`,
      { responseType: "blob" },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};
