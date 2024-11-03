import axios from "axios";

export const fetchTrashBinData = async (teamId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/trash/${teamId}/`,
  );

  return response.data.trashBin;
};