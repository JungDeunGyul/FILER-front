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

  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      <div className="absolute top-24 right-72">
        <button
          className="px-4 py-2 text-lg bg-blue-500 text-white rounded"
          onClick={() => navigate("/exploreteam")}
        >
          팀 가입/생성
        </button>
      </div>
      <div className="border w-4/6 h-4/6">
        <div className="flex justify-end mr-5">
          <input
            type="text"
            placeholder="팀 이름을 입력하세요"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="p-2 mt-4 ml-5 border"
          />
        </div>
        <div className="grid grid-cols-4 gap-6 m-2 p-2">
          {filteredTeams.map((team) => (
            <div key={team._id} className="p-7 m-1 border relative">
              <p className="text-lg font-bold absolute top-1 left-2">
                {team.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyTeam;
