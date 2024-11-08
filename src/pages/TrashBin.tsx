import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { LeaveTeam } from "@modal/LeaveTeam";
import { DeleteRestoreFileFolder } from "@modal/DeleteRestoreFileFolder";
import { ManageTeamMembers } from "@modal/ManageTeamMembers";

import { useCurrentTeam } from "@utils/hook/useCurrentTeam";
import { getFileIconUrl } from "@utils/fileIconURL";
import { fetchTrashBinData } from "@api/fetchTrashBinData";

import type { User, OwnedFolder, OwnedFiles } from "userRelatedTypes";

import LoadingMessage from "@components/LoadingMessage";

interface TrashBinType {
  _id: string;
  ownerTeam: string;
  files: Files[];
  folders: Folders[];
}

interface Folders {
  _id: string;
  deleted_at: Date;
  item: OwnedFolder;
  itemType: string;
}

interface Files {
  _id: string;
  deleted_at: Date;
  item: OwnedFiles;
  itemType: string;
}

function TrashBin() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<User>(["userData"]);

  const [isLeaveTeamModalOpen, setLeaveTeamModalOpen] = useState(false);
  const [
    isDeleteRestoreFileFolderModalOpen,
    setDeleteRestoreFileFolderModalOpen,
  ] = useState(false);
  const [isManageTeamMemberModalOpen, setManageTeamMemberModalOpen] =
    useState(false);

  const [selectedElementId, setSelectedElementId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const { currentTeam, currentUserRole } = useCurrentTeam(
    userData as User,
    teamId as string,
  );

  const { data: trashBin } = useQuery<TrashBinType>({
    queryKey: ["trashBin"],
    queryFn: () => fetchTrashBinData(teamId as string),
    enabled: !!currentTeam,
  });

  const filteredFolders = useMemo<Folders[]>(() => {
    return trashBin
      ? trashBin.folders.filter((folder) =>
          folder.item.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];
  }, [filterValue, trashBin]);

  const filteredFiles = useMemo<Files[]>(() => {
    return trashBin
      ? trashBin.files.filter((file) =>
          file.item.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];
  }, [filterValue, trashBin]);

  const handleFolderClick = (folderId: string) => {
    if (!currentTeam) {
      return;
    }

    navigate(
      `/team/${encodeURIComponent(currentTeam._id)}/folder/${encodeURIComponent(
        folderId,
      )}`,
    );
  };

  const handleLeaveTeamClick = () => {
    setLeaveTeamModalOpen(true);
  };

  const handleDeleteRestoreModalClick = (elementId: string, type: string) => {
    setSelectedElementId(elementId);
    setSelectedType(type);
    setDeleteRestoreFileFolderModalOpen(true);
  };

  const handleTeamMemberClick = () => {
    setManageTeamMemberModalOpen(true);
  };

  if (!userData || !teamId || !currentTeam) {
    return <LoadingMessage message="유저 정보를 불러오는 중입니다" />;
  }

  const userId = userData._id;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="md:w-1/6 bg-gray-100 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div
            onClick={() => handleLeaveTeamClick()}
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
          queryClient={queryClient}
          userData={userData}
        />
      )}
    </div>
  );
}

export default TrashBin;
