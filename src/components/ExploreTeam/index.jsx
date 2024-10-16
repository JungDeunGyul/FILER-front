import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TeamFormModal } from "../Modal/TeamFormModal";

function ExploreTeam() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = (isCreateMode) => {
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
          />
        </div>
      )}
    </div>
  );
}

export default ExploreTeam;
