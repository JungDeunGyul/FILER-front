import axios from "axios";

export const handleDownloadFile = async (teamId, fileId, fileName) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/team/${teamId}/file/${fileId}`,
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
