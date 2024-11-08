import { Dispatch, SetStateAction } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UseManageTeamRequestsProps {
  queryClient: QueryClient;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  navigate: (path: string) => void;
}

interface UseManageTeamRequestsMutatinParams {
  url: string;
  isCreateMode: boolean;
}

export const useManageTeamRequests = ({
  queryClient,
  setErrorMessage,
  setSuccessMessage,
  setModalOpen,
  setLoading,
  navigate,
}: UseManageTeamRequestsProps) => {
  return useMutation({
    mutationFn: async ({
      url,
      isCreateMode,
    }: UseManageTeamRequestsMutatinParams) => {
      const response = await axios({
        method: isCreateMode ? "post" : "patch",
        url,
        data: isCreateMode ? {} : { action: "가입요청" },
      });

      return response.data;
    },
    onSuccess: async (data) => {
      const successMsg = data.message
        ? data.message
        : "신청이 성공적으로 완료되었습니다!";

      setSuccessMessage(successMsg);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      navigate("/myteam");
    },
    onError: async (error) => {
      const errorMsg = error.message
        ? error.message
        : "팀 생성 오류가 발생하였습니다";

      setErrorMessage(errorMsg);

      await new Promise<void>((resolve) =>
        setTimeout(() => {
          setErrorMessage("");
          setLoading(false);
          setModalOpen(false);
          resolve();
        }, 3000),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userData"],
      });
    },
  });
};
