import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLoginUser = (navigate, setUserId) => {
  return useMutation({
    mutationFn: async ({ email, nickname, photoURL, token }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/login`,
        {
          user: { email, nickname, photoURL },
          token,
        },
        { withCredentials: true },
      );

      return response.data.user;
    },
    onSuccess: (data) => {
      const userId = data._id;

      setUserId(userId);
      navigate("/home");
    },
    onError: (error) => {
      console.error("로그인 실패", error);
    },
  });
};
