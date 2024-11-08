import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { TeamFormModal } from "@modal/TeamFormModal";
import LoadingMessage from "@components/LoadingMessage";

import { User } from "userRelatedTypes";

function ExploreTeam() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<User>(["userData"]);

  if (!userData) {
    return <LoadingMessage message="유저 정보를 불러오는 중입니다" />;
  }

  const handleOpenModal = (isCreateMode: boolean) => {
    setIsCreateMode(isCreateMode);
    setModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center bg-white p-10 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">팀 관리</h1>
        <div className="flex gap-6">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
            onClick={() => navigate("/myteam")}
          >
            팀 페이지로 이동
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
            onClick={() => handleOpenModal(true)}
          >
            팀 생성하기
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
            onClick={() => handleOpenModal(false)}
          >
            팀 찾기
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <TeamFormModal
            setModalOpen={setModalOpen}
            isCreateMode={isCreateMode}
            userData={userData}
            queryClient={queryClient}
          />
        </div>
      )}
    </div>
  );
}

export default ExploreTeam;
