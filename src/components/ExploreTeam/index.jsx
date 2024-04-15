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
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-10">팀 관리</h1>
        <div className="flex gap-5">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={() => navigate("/myteam")}
          >
            팀 페이지로 이동
          </button>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={handleCreateTeam}
          >
            팀 생성하기
          </button>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
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
