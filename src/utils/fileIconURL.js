export const getFileIconUrl = (fileType) => {
  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "https://img.icons8.com/color/48/ms-excel.png";
  } else if (fileType === "application/pdf") {
    return "https://img.icons8.com/officel/16/pdf.png";
  } else if (
    fileType === "image/jpeg" ||
    fileType === "image/gif" ||
    fileType === "image/bmp" ||
    fileType === "image/png"
  ) {
    return "https://img.icons8.com/color/48/image.png";
  } else if (fileType === "audio/mpeg" || fileType === "audio/midi") {
    return "https://img.icons8.com/ios/50/high-volume--v1.png";
  } else if (fileType === "application/zip") {
    return "https://img.icons8.com/ios/50/zip.png";
  } else if (
    fileType === "application/vnd.ms-powerpoint" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return "https://img.icons8.com/fluency/48/microsoft-powerpoint-2019.png";
  } else {
    return "https://img.icons8.com/ios/50/code--v1.png";
  }
};
