import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { LeaveTeam } from "../../components/modal/LeaveTeam";
import { DeleteRestoreFileFolder } from "../../components/modal/DeleteRestoreFileFolder";
import { ManageTeamMembers } from "../../components/modal/ManageTeamMembers";

import { getFileIconUrl } from "../../utils/fileIconURL";
import { fetchTrashBinData } from "../../utils/api/fetchTrashBinData";

function TrashBin() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["userData"]);
  const userId = userData._id;

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

  const { data: trashBin } = useQuery({
    queryKey: ["trashBin"],
    queryFn: () => fetchTrashBinData(teamId),
    enabled: !!currentTeam,
  });

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
      <div className="relative flex items-center justify-center w-full h-screen">
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="md:w-1/6 bg-gray-100 p-4 overflow-auto">
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
                className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-200"
              >
                <span className="text-gray-700">📁 {folder.name}</span>
              </li>
            ))}
        </ul>
        <button
          onClick={() =>
            navigate(`/team/${encodeURIComponent(currentTeam._id)}/trash`)
          }
          className="block w-full mt-4 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          🗑️ 휴지통
        </button>
      </div>
      <div className="flex-grow p-4 overflow-auto">
        <div>
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/myteam")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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
              className="block w-full px-3 py-2 border rounded-md mb-4"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFolders.map((folder) => (
                <div
                  key={folder.item._id}
                  onClick={() =>
                    handleDeleteRestoreModalClick(folder.item._id, "folder")
                  }
                  className="group relative cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:scale-105 bg-white"
                >
                  <span className="block text-lg font-medium text-gray-600 truncate">
                    📁 {folder.item.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.item._id}
                  onClick={() =>
                    handleDeleteRestoreModalClick(file.item._id, "file")
                  }
                  className="group relative cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:scale-105 bg-white"
                >
                  <img
                    src={getFileIconUrl(file.item.type)}
                    alt={file.item.type}
                    className="w-12 h-12 mb-2 transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className="block text-lg font-medium text-gray-600 truncate">
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
          queryClient={queryClient}
          userData={userData}
        />
      )}
      {isDeleteRestoreFileFolderModalOpen && (
        <DeleteRestoreFileFolder
          setDeleteRestoreFileFolderModalOpen={
            setDeleteRestoreFileFolderModalOpen
          }
          selectedElementId={selectedElementId}
          selectedType={selectedType}
          currentUserRole={currentUserRole}
          userId={userId}
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
