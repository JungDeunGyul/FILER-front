import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { LeaveTeam } from "../Modal/LeaveTeam";
import { DeleteRestoreFileFolder } from "../Modal/DeleteRestoreFileFolder";

import { getFileIconUrl } from "../../utils/fileIconURL";

import useUserStore from "../store/userData";

import axios from "axios";

function TrashBin() {
  const { userData } = useUserStore();
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [isLeaveTeamModalOpen, setLeaveTeamModalOpen] = useState(false);
  const [
    isDeleteRestoreFileFolderModalOpen,
    setDeleteRestoreFileFolderModalOpen,
  ] = useState(false);

  const [selectedElementId, setSelectedElementId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentUserRole, setUserRole] = useState("");

  const [currentTeam, setCurrentTeam] = useState(null);
  const [trashBin, setTrashBin] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const team = userData.teams.find((team) => team._id === teamId);

    if (team !== currentTeam) {
      setCurrentTeam(team);
    }

    if (team && team.members) {
      const currentUser = team.members.find(
        (user) => user.user.nickname === userData.nickname,
      );

      const currentUserRole = currentUser ? currentUser.role : "";
      setUserRole(currentUserRole);
    }
  }, [userData.teams, teamId, currentTeam]);

  useEffect(() => {
    if (currentTeam) {
      getData();
    }
  }, [currentTeam]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/trash/${teamId}/`,
      );

      setTrashBin(response.data.trashBin);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredFolders =
    trashBin && trashBin.folders
      ? trashBin.folders.filter((folder) =>
          folder.item.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];

  const filteredFiles =
    trashBin && trashBin.files
      ? trashBin.files.filter((file) =>
          file.item.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];

  const handleFolderClick = (folderId) => {
    navigate(
      `/team/${encodeURIComponent(currentTeam._id)}/folder/${encodeURIComponent(
        folderId,
      )}`,
    );
  };

  const handleLeaveTeamClick = () => {
    setLeaveTeamModalOpen(true);
  };

  const handleDeleteRestoreModalClick = (elementId, type) => {
    setSelectedElementId(elementId);
    setSelectedType(type);
    setDeleteRestoreFileFolderModalOpen(true);
  };

  if (!currentTeam) {
    return (
      <div className="relative flex items-center justify-center h-screen w-full">
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-start w-48 h-screen space-y-5 border-t-2 border-r-2 border-gray-300">
        <div className="flex w-48 mt-2">
          <div
            onClick={() => handleLeaveTeamClick(true)}
            style={{ cursor: "pointer" }}
            className="text-2xl font-bold"
          >
            {currentTeam.name}
          </div>
          {currentTeam.members.slice(0, 3).map((user) => (
            <img
              key={user._id}
              src={user.user.iconpath}
              className="rounded-full ml-1 h-8 w-8"
              alt="user icon"
            />
          ))}
          {currentTeam.members.length > 3 && (
            <div className="flex rounded-full ml-2 h-8 w-8 bg-gray-300">
              +{currentTeam.members.length - 3}
            </div>
          )}
        </div>
        {currentTeam.ownedFolders &&
          currentTeam.ownedFolders.map((folder) => (
            <div
              key={folder._id}
              style={{ cursor: "pointer" }}
              onClick={() => handleFolderClick(folder._id)}
            >
              <p className="text-lg font-bold">📁 {folder.name}</p>
            </div>
          ))}
        <div style={{ cursor: "pointer" }}>
          <button>🗑️ 휴지통</button>
        </div>
      </div>
      <div className="flex-grow flex flex-col">
        <div>
          <div className="flex justify-end m-5">
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
                key={folder.item._id}
                onClick={() =>
                  handleDeleteRestoreModalClick(folder.item._id, "folder")
                }
                style={{ cursor: "pointer" }}
                className="bg-gray-300 p-7 m-1 border relative"
              >
                <p className="text-lg font-bold absolute top-1 left-2">
                  📁 {folder.item.name}
                </p>
              </div>
            ))}
          </div>
          <p>파 일</p>
          <div className="grid grid-cols-4 gap-6 m-2 p-2">
            {filteredFiles.map((file) => (
              <div
                key={file.item._id}
                onClick={() =>
                  handleDeleteRestoreModalClick(file.item._id, "file")
                }
                className="bg-gray-300 p-7 m-1 border relative flex flex-col"
              >
                <div style={{ cursor: "pointer" }}>
                  <img
                    src={getFileIconUrl(file.item.type)}
                    alt={file.item.type}
                    className="absolute top-1 left-2"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <p className="text-lg font-bold absolute">
                    {file.item.name.length > 20
                      ? `${file.item.name.substring(0, 15)}...`
                      : file.item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isLeaveTeamModalOpen && (
        <LeaveTeam
          setLeaveTeamModalOpen={setLeaveTeamModalOpen}
          currentTeam={currentTeam}
        />
      )}
      {isDeleteRestoreFileFolderModalOpen && (
        <DeleteRestoreFileFolder
          setDeleteRestoreFileFolderModalOpen={
            setDeleteRestoreFileFolderModalOpen
          }
          selectedElementId={selectedElementId}
          selectedType={selectedType}
          setTrashBin={setTrashBin}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
}

export default TrashBin;
