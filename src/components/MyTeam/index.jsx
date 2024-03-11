import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userData";

function MyTeam() {
  const { userData } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      <div className="absolute top-24 right-72">
        <button
          className="px-4 py-2 text-lg bg-blue-500 text-white rounded"
          onClick={() => navigate("/exploreteam")}
        >
          팀 찾기/생성
        </button>
      </div>

      <div className="border w-4/6 h-4/6">
        <div className="grid grid-cols-4 gap-6 m-2 p-2">
          {userData.teams.map((team) => (
            <div key={team._id} className="p-7 m-1 border relative ">
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
