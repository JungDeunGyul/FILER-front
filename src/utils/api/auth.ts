import { Dispatch, SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UseLoginUser {
  navigate: (path: string) => void;
  setUserId: Dispatch<SetStateAction<string | null>>;
}

interface LoginUserParams {
  email: string;
  nickname: string;
  photoURL: string;
  token: string;
}

export const useLoginUser = ({ navigate, setUserId }: UseLoginUser) => {
  return useMutation({
    mutationFn: async ({
      email,
      nickname,
      photoURL,
      token,
    }: LoginUserParams) => {
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

      sessionStorage.setItem("userId", userId);

      setUserId(userId);
      navigate("/home");
    },
    onError: (error) => {
      console.error("로그인 실패", error);
    },
  });
};
