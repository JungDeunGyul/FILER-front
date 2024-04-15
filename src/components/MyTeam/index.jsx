import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userData";

function MyTeam() {
  const { userData } = useUserStore();
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");

  const filteredTeams = userData.teams.filter((team) =>
    team.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const handleTeamClick = (teamId) => {
    navigate(`/team/${encodeURIComponent(teamId)}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-4/6 h-5/6 bg-white shadow-lg rounded-md">
        <div className="flex justify-end p-5">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => navigate("/exploreteam")}
          >
            팀 가입/생성
          </button>
        </div>
        <div className="p-5">
          <input
            type="text"
            placeholder="팀 이름을 입력하세요"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 p-5">
          {filteredTeams.map((team) => (
            <div
              key={team._id}
              onClick={() => handleTeamClick(team._id)}
              className="flex items-center justify-center p-5 border rounded-md cursor-pointer hover:bg-gray-100"
            >
              <p className="text-lg font-bold">{team.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyTeam;
