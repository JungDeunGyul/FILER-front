import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreateTeam } from "../Modal/CreateTeam";
import { FindTeam } from "../Modal/FindTeam";

function ExploreTeam() {
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [isFindTeamModalOpen, setFindTeamModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    setCreateTeamModalOpen(true);
  };

  const handleFindTeam = () => {
    setFindTeamModalOpen(true);
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
            onClick={handleCreateTeam}
          >
            팀 생성하기
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
            onClick={handleFindTeam}
          >
            팀 찾기
          </button>
        </div>
      </div>
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <CreateTeam setCreateTeamModalOpen={setCreateTeamModalOpen} />
        </div>
      )}
      {isFindTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <FindTeam setFindTeamModalOpen={setFindTeamModalOpen} />
        </div>
      )}
    </div>
  );
}

export default ExploreTeam;
