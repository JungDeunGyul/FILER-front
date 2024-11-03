import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useManageTeamRequests } from "../../utils/api/manageTeamRequests";

export function TeamFormModal({
  setModalOpen,
  isCreateMode,
  userData,
  queryClient,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const teamInputRef = useRef(null);
  const navigate = useNavigate();

  const manageTeamReuestsMutation = useManageTeamRequests(
    queryClient,
    setErrorMessage,
    setSuccessMessage,
    setModalOpen,
    setLoading,
    navigate,
  );

  const handleCloseModals = () => {
    setModalOpen(false);
  };

  const handleChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const teamName = teamInputRef.current.value;

    if (
      teamName.length < 3 ||
      teamName.length > 10 ||
      /[!@#$%^&*(),.?":{}|<>]/.test(teamName)
    ) {
      setErrorMessage(
        "팀 이름은 3자 이상, 10자 이하이며 특수문자를 포함할 수 없습니다.",
      );
      setLoading(false);
      return;
    }

    const url = isCreateMode
      ? `${import.meta.env.VITE_SERVER_URL}/team/${teamName}/new/${
          userData._id
        }`
      : `${import.meta.env.VITE_SERVER_URL}/team/${teamName}/joinrequest/${
          userData._id
        }`;

    manageTeamReuestsMutation.mutate({ url, isCreateMode });
  };

  return (
    <div className="fixed w-4/6 h-4/6 z-10 bg-gray flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-50 rounded-md items-center bg-white p-6">
          <label className="text-2xl font-bold mb-4">
            {isCreateMode
              ? "만들 팀 이름을 입력해주세요"
              : "찾는 팀 이름을 입력해주세요"}
          </label>
          <input
            ref={teamInputRef}
            onChange={handleChange}
            className="border rounded-md p-3 mb-4 w-full"
            disabled={loading}
          />
          <div className={`mb-10 h-32 overflow-hidden`}>
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-blue-500 mb-2">{successMessage}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-full bg-slate-900 text-white px-4 py-2"
            disabled={loading}
          >
            {loading
              ? isCreateMode
                ? "생성 중..."
                : "신청 중..."
              : isCreateMode
              ? "생성하기"
              : "신청하기"}
          </button>
          <button
            onClick={handleCloseModals}
            className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
            disabled={loading}
          >
            나가기
          </button>
        </div>
      </form>
    </div>
  );
}
