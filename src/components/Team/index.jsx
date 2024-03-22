import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CreateFolder } from "../Modal/CreateFolder";
import { LeaveTeam } from "../Modal/LeaveTeam";
import { FileDetail } from "../Modal/FileDetail";
import { PermissionSetting } from "../Modal/PermissionSetting";
import { FolderAccess } from "../Modal/FolderAccess";

import { getFileIconUrl } from "../../utils/fileIconURL";
import { handleDownloadFile } from "../../utils/downloadFile";

import DropZone from "../DropZone";
import useUserStore from "../store/userData";

import axios from "axios";

function Team() {
  const { userData, setUserData } = useUserStore();
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [isLeaveTeamModalOpen, setLeaveTeamModalOpen] = useState(false);
  const [isFileDetailOpen, setFileDetailOpen] = useState(false);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [isFolderAccessModalOpen, setFolderAccessModalOpen] = useState(false);

  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentUserRole, setUserRole] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState("");
  const [selectedType, setSelectedType] = useState("");

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

  const handleFolderClick = (folderId, folderVisibleTo) => {
    if (
      folderVisibleTo !== "수습" &&
      currentUserRole !== "팀장" &&
      folderVisibleTo !== currentUserRole
    ) {
      setFolderAccessModalOpen(true);
      setTimeout(() => {
        setFolderAccessModalOpen(false);
      }, 2000);
      return;
    }

    navigate(
      `/team/${encodeURIComponent(currentTeam._id)}/folder/${encodeURIComponent(
        folderId,
      )}`,
    );
  };

  const handleFileClick = (fileId) => {
    setSelectedFile(fileId);
  };

  const handleViewDetails = (file) => {
    if (
      file.visibleTo !== "수습" &&
      currentUserRole !== "팀장" &&
      file.visibleTo !== currentUserRole
    ) {
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
    setFileDetailOpen(true);
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  const handleCreateFolderClick = () => {
    setCreateFolderModalOpen(true);
  };

  const handleLeaveTeamClick = () => {
    setLeaveTeamModalOpen(true);
  };

  const handlePermissionClick = (elementId, type) => {
    setSelectedElementId(elementId);
    setSelectedType(type);
    setPermissionModalOpen(true);
  };

  const handleFileDragStart = (event, fileId) => {
    event.dataTransfer.setData("fileId", fileId);
  };

  const handleFolderDragStart = (event, folderId) => {
    event.dataTransfer.setData("folderId", folderId);
  };

  const handleFolderDrop = async (event, folderId) => {
    event.preventDefault();

    const fileId = event.dataTransfer.getData("fileId");
    moveFileToFolder(fileId, folderId);
  };

  const moveFileToFolder = async (fileId, folderId) => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/file/${fileId}/move-to-folder/${folderId}`,
        { userId: userData._id, currentUserRole },
      );

      setUserData(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickTrashBin = () => {
    navigate(`/team/${encodeURIComponent(currentTeam._id)}/trash`);
  };

  const moveFileToTrash = async (fileId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/trash/file/${fileId}/`,
        { userId: userData._id, currentUserRole },
      );

      setUserData(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const moveFolderToTrash = async (folderId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/trash/folder/${folderId}/`,
        { userId: userData._id, currentUserRole },
      );

      setUserData(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTrashDragOver = (event) => {
    event.preventDefault();
  };

  const handleTrashDrop = (event) => {
    event.preventDefault();

    const fileId = event.dataTransfer.getData("fileId");
    const folderId = event.dataTransfer.getData("folderId");

    if (fileId) {
      moveFileToTrash(fileId);
    } else if (folderId) {
      moveFolderToTrash(folderId);
    }
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
              onClick={() => handlePermissionClick(folder._id, "folder")}
              style={{ cursor: "pointer" }}
            >
              <p className="text-lg font-bold">📁 {folder.name}</p>
            </div>
          ))}
        <div
          onDragOver={handleTrashDragOver}
          onDrop={handleTrashDrop}
          style={{ cursor: "pointer" }}
          draggable="true"
          onDragStart={(e) => handleFileDragStart(e, "trash")}
        >
          <button onClick={handleClickTrashBin}>🗑️ 휴지통</button>
        </div>
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
          <DropZone teamId={currentTeam._id} userId={userData._id} />
          <div className="flex justify-end mr-5">
            <input
              type="text"
              placeholder="폴더 / 파일 명을 입력하세요"
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              className="p-2 mt-4 ml-5 border"
            />
          </div>
          <p>폴 더</p>
          <div className="grid grid-cols-4 gap-6 m-2 p-2">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                onDragStart={(event) =>
                  handleFolderDragStart(event, folder._id)
                }
                draggable="true"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleFolderClick(folder._id, folder.visibleTo);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(event) => handleFolderDrop(event, folder._id)}
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
                draggable="true"
                onDragStart={(e) => handleFileDragStart(e, file._id)}
                className="bg-gray-300 p-7 m-1 border relative flex flex-col"
              >
                <div
                  onClick={() => handleFileClick(file._id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={getFileIconUrl(file.type)}
                    alt={file.type}
                    className="absolute top-1 left-2"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <p className="text-lg font-bold absolute">
                    {file.name.length > 20
                      ? `${file.name.substring(0, 15)}...`
                      : file.name}
                  </p>
                </div>
                {selectedFile === file._id && (
                  <div className="file-options mt-2">
                    <button
                      onClick={() =>
                        handleDownloadFile(
                          teamId,
                          file._id,
                          file.name,
                          currentUserRole,
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      다운로드
                    </button>
                    <button
                      onClick={() => handleViewDetails(file)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      자세히 보기
                    </button>
                    <button
                      onClick={() => handlePermissionClick(file._id, "file")}
                      className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                    >
                      권한 설정
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <CreateFolder
            setCreateFolderModalOpen={setCreateFolderModalOpen}
            teamName={currentTeam.name}
          />
        </div>
      )}
      {isLeaveTeamModalOpen && (
        <LeaveTeam
          setLeaveTeamModalOpen={setLeaveTeamModalOpen}
          currentTeam={currentTeam}
        />
      )}
      {isFileDetailOpen && (
        <FileDetail setFileDetailOpen={setFileDetailOpen} file={selectedFile} />
      )}
      {isPermissionModalOpen && (
        <PermissionSetting
          setPermissionModalOpen={setPermissionModalOpen}
          selectedElementId={selectedElementId}
          selectedType={selectedType}
          currentUserRole={currentUserRole}
        />
      )}
      {isFolderAccessModalOpen && (
        <FolderAccess setFolderAccessModalOpen={setFolderAccessModalOpen} />
      )}
    </div>
  );
}

export default Team;
