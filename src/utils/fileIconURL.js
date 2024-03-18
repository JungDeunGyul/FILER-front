export const getFileIconUrl = (fileType) => {
  switch (fileType) {
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "https://img.icons8.com/color/48/ms-excel.png";
    case "application/pdf":
      return "https://img.icons8.com/officel/16/pdf.png";
    case "image/jpeg" || "image/gif" || "image/bmp":
      return "https://img.icons8.com/color/48/image.png";
    case "audio/mpeg" || "audio/midi":
      return "https://img.icons8.com/ios/50/high-volume--v1.png";
    case "application/zip":
      return "https://img.icons8.com/ios/50/zip.png";
    case "application/vnd.ms-powerpoint" ||
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "https://img.icons8.com/fluency/48/microsoft-powerpoint-2019.png";
    default:
      return "https://img.icons8.com/ios/50/code--v1.png";
  }
};
