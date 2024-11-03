import axios from "axios";

export const fetchFolderData = async (currentUserRole, folderId) => {
  console.log("fetchFolderData", currentUserRole, folderId);
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/folder/${folderId}/`,
    {
      data: { currentUserRole },
    },
  );

  return response.data.folder;
};
