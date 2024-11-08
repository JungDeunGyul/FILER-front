export const getFileIconUrl = (fileType: string) => {
  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return import.meta.env.VITE_EXCEL_ICON_URL;
  } else if (fileType === "application/pdf") {
    return import.meta.env.VITE_PDF_ICON_URL;
  } else if (
    fileType === "image/jpeg" ||
    fileType === "image/gif" ||
    fileType === "image/bmp" ||
    fileType === "image/png"
  ) {
    return import.meta.env.VITE_IMAGE_ICON_URL;
  } else if (fileType === "audio/mpeg" || fileType === "audio/midi") {
    return import.meta.env.VITE_AUDIO_ICON_URL;
  } else if (fileType === "application/zip") {
    return import.meta.env.VITE_ZIP_ICON_URL;
  } else if (
    fileType === "application/vnd.ms-powerpoint" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return import.meta.env.VITE_POWERPOINT_ICON_URL;
  } else {
    return import.meta.env.VITE_DEFAULT_ICON_URL;
  }
};
