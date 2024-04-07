import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { LeaveTeam } from "../Modal/LeaveTeam";
import { DeleteRestoreFileFolder } from "../Modal/DeleteRestoreFileFolder";
import { ManageTeamMembers } from "../Modal/ManageTeamMembers";

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
  const [isManageTeamMemberModalOpen, setManageTeamMemberModalOpen] =
    useState(false);

  const [selectedElementId, setSelectedElementId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentUserRole, setUserRole] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [currentTeam, setCurrentTeam] = useState(null);
  const [trashBin, setTrashBin] = useState([]);

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

  const handleTeamMemberClick = () => {
    setManageTeamMemberModalOpen(true);
  };

  if (!currentTeam) {
    return (
      <div className="relative flex items-center justify-center h-screen w-full">
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <div
            onClick={() => handleLeaveTeamClick(true)}
            className="text-xl font-bold cursor-pointer"
          >
            {currentTeam.name}
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleTeamMemberClick()}
          >
            {currentTeam.members.slice(0, 3).map((user) => (
              <img
                key={user._id}
                src={user.user.iconpath}
                className="w-8 h-8 rounded-full ml-1"
                alt="user icon"
              />
            ))}
            {currentTeam.members.length > 3 && (
              <div className="ml-1">+{currentTeam.members.length - 3}</div>
            )}
          </div>
        </div>
        <ul>
          {currentTeam.ownedFolders &&
            currentTeam.ownedFolders.map((folder) => (
              <li
                key={folder._id}
                onClick={() => handleFolderClick(folder._id)}
                className="cursor-pointer py-2 px-3 rounded-md hover:bg-gray-200"
              >
                <span className="text-gray-700">📁 {folder.name}</span>
              </li>
            ))}
        </ul>
        <button
          onClick={() =>
            navigate(`/team/${encodeURIComponent(currentTeam._id)}/trash`)
          }
          className="block w-full mt-4 py-2 px-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          🗑️ 휴지통
        </button>
      </div>
      <div className="flex-grow p-4">
        <div>
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/myteam")}
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              팀 목록
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="폴더 / 파일 명을 입력하세요"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="block w-full py-2 px-3 border rounded-md mb-4"
            />
            <div className="grid grid-cols-4 gap-4">
              {filteredFolders.map((folder) => (
                <div
                  key={folder.item._id}
                  onClick={() =>
                    handleDeleteRestoreModalClick(folder.item._id, "folder")
                  }
                  className="group relative cursor-pointer border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                >
                  <span className="block mb-2 text-gray-600">
                    📁 {folder.item.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.item._id}
                  onClick={() =>
                    handleDeleteRestoreModalClick(file.item._id, "file")
                  }
                  className="group relative cursor-pointer border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                >
                  <img
                    src={getFileIconUrl(file.item.type)}
                    alt={file.item.type}
                    className="w-8 h-8 mr-2"
                  />
                  <span className="text-gray-600">
                    {file.item.name.length > 20
                      ? `${file.item.name.substring(0, 20)}...`
                      : file.item.name}
                  </span>
                </div>
              ))}
            </div>
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
      {isManageTeamMemberModalOpen && (
        <ManageTeamMembers
          setManageTeamMemberModalOpen={setManageTeamMemberModalOpen}
          currentTeam={currentTeam}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
}

export default TrashBin;
