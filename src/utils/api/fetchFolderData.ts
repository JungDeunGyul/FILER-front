import axios from "axios";

export const fetchFolderData = async (
  currentUserRole: string,
  folderId: string,
) => {
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/folder/${folderId}/`,
    {
      data: { currentUserRole },
    },
  );

  return response.data.folder;
};
