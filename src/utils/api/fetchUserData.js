import axios from "axios";

export const fetchUserData = async (userId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/me/${userId}`,
  );

  return response.data.user;
};
