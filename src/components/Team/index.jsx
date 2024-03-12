import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useUserStore from "../store/userData";
import { CreateFolder } from "../Modal/CreateFolder";

function Team() {
  const { userData } = useUserStore();
  const { teamName } = useParams();
  const navigate = useNavigate();

  const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const team = userData.teams.find((team) => team.name === teamName);
    if (team !== currentTeam) {
      setCurrentTeam(team);
    }
  }, [userData.teams, teamName, currentTeam]);

  const filteredFolders = currentTeam
    ? currentTeam.ownedFolders.filter((folder) =>
        folder.name.toLowerCase().includes(filterValue.toLowerCase()),
      )
    : [];

  const filteredFiles = currentTeam
    ? currentTeam.ownedFiles.filter((file) =>
        file.name.toLowerCase().includes(filterValue.toLowerCase()),
      )
    : [];

  const handleFolderClick = (folderName) => {
    navigate(
      `/team/${encodeURIComponent(teamName)}/folder/${encodeURIComponent(
        folderName,
      )}`,
    );
  };

  const handleCreateFolderClick = () => {
    setCreateFolderModalOpen(true);
  };

  if (!currentTeam) {
    return (
      <div className="relative flex items-center justify-center h-screen w-full">
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col items-start w-48 space-y-5 border-t-2 border-r-2 border-gray-300">
        <div className="flex justify-between w-48 mt-2">
          <div className="text-2xl font-bold">{currentTeam.name}</div>
          {currentTeam.members.slice(0, 3).map((user) => (
            <img
              key={user._id}
              src={user.user.iconpath}
              className="rounded-full h-8 w-8"
              alt="user icon"
            />
          ))}
          {currentTeam.members.length > 3 && (
            <div className="flex items-center justify-center rounded-full h-8 w-8 bg-gray-300 text-center">
              +{currentTeam.members.length - 3}
            </div>
          )}
        </div>
        {currentTeam.ownedFolders &&
          currentTeam.ownedFolders.map((folder) => (
            <div
              key={folder._id}
              onClick={() => handleFolderClick(folder.name)}
              style={{ cursor: "pointer" }}
            >
              <p className="text-lg font-bold">📁 {folder.name}</p>
            </div>
          ))}
        <button>🗑️ 휴지통</button>
      </div>
      <div className="flex-grow flex flex-col">
        <div>
          <div className="flex justify-end m-5">
            <button
              className="px-4 py-2 text-lg bg-gray-500 text-white rounded mr-2"
              onClick={() => handleCreateFolderClick()}
            >
              폴더 생성하기
            </button>
            <button
              className="px-4 py-2 text-lg bg-blue-500 text-white rounded"
              onClick={() => navigate("/myteam")}
            >
              팀 목록
            </button>
          </div>
        </div>

        <div className="flex-grow border-2 border-gray-200 m-5">
          <div className="flex justify-end mr-5">
            <input
              type="text"
              placeholder="폴더 / 파일 명을 입력하세요"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="p-2 mt-4 ml-5 border"
            />
          </div>
          <p>폴 더</p>
          <div className="grid grid-cols-4 gap-6 m-2 p-2">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleFolderClick(folder.name);
                }}
                className="bg-gray-300 p-7 m-1 border relative"
              >
                <p className="text-lg font-bold absolute top-1 left-2">
                  📁 {folder.name}
                </p>
              </div>
            ))}
          </div>
          <p>파 일</p>
          <div className="grid grid-cols-4 gap-6 m-2 p-2">
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                style={{ cursor: "pointer" }}
                className="bg-gray-300 p-7 m-1 border relative"
              >
                <p className="text-lg font-bold absolute top-1 left-2">
                  📁 {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <CreateFolder
            setCreateFolderModalOpen={setCreateFolderModalOpen}
            teamName={teamName}
          />
        </div>
      )}
    </div>
  );
}

export default Team;
