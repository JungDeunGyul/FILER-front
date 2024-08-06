import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CreateFolder } from "../Modal/CreateFolder";
import { LeaveTeam } from "../Modal/LeaveTeam";
import { FileDetail } from "../Modal/FileDetail";
import { PermissionSetting } from "../Modal/PermissionSetting";
import { FolderAccess } from "../Modal/FolderAccess";
import { ManageTeamMembers } from "../Modal/ManageTeamMembers";

import { getFileIconUrl } from "../../utils/fileIconURL";
import { handleDownloadFile } from "../../utils/downloadFile";
import { DocViewerWrapper } from "../../utils/docViewerWrapper";

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
  const [isManageTeamMemberModalOpen, setManageTeamMemberModalOpen] =
    useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [currentTeam, setCurrentTeam] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentUserRole, setUserRole] = useState("");
  const [filterValue, setFilterValue] = useState("");
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

  const filteredFolders = useMemo(() => {
    return currentTeam
      ? currentTeam.ownedFolders.filter((folder) =>
          folder.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];
  }, [currentTeam, filterValue]);

  const filteredFiles = useMemo(() => {
    return currentTeam
      ? currentTeam.ownedFiles.filter((file) =>
          file.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];
  }, [currentTeam, filterValue]);

  const handleFolderClick = useCallback(
    (folderId, folderVisibleTo) => {
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
        `/team/${encodeURIComponent(
          currentTeam._id,
        )}/folder/${encodeURIComponent(folderId)}`,
      );
    },
    [currentUserRole, navigate, currentTeam],
  );

  const handleFileClick = useCallback((fileId) => {
    setSelectedFile(fileId);
  }, []);

  const handleViewDetails = useCallback(
    (file) => {
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
    },
    [currentUserRole],
  );

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleCreateFolderClick = useCallback(() => {
    setCreateFolderModalOpen(true);
  }, []);

  const handleLeaveTeamClick = useCallback(() => {
    setLeaveTeamModalOpen(true);
  }, []);

  const handlePermissionClick = useCallback((event, elementId, type) => {
    setSelectedElementId(elementId);
    setSelectedType(type);
    setPermissionModalOpen(true);
    setClickPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleTeamMemberClick = useCallback(() => {
    setManageTeamMemberModalOpen(true);
  }, []);

  const handleFileDragStart = useCallback((event, fileId) => {
    event.dataTransfer.setData("fileId", fileId);
  }, []);

  const handleFolderDragStart = useCallback((event, folderId) => {
    event.dataTransfer.setData("folderId", folderId);
  }, []);

  const moveFileToFolder = useCallback(
    async (fileId, folderId) => {
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
    },
    [currentUserRole, setUserData, userData._id],
  );

  const handleFolderDrop = useCallback(
    async (event, folderId) => {
      event.preventDefault();

      const fileId = event.dataTransfer.getData("fileId");
      moveFileToFolder(fileId, folderId);
    },
    [moveFileToFolder],
  );

  const handleClickTrashBin = () => {
    navigate(`/team/${encodeURIComponent(currentTeam._id)}/trash`);
  };

  const moveFileToTrash = useCallback(
    async (fileId) => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/trash/file/${fileId}/`,
          { userId: userData._id, currentUserRole },
        );

        setUserData(response.data.user);
      } catch (error) {
        console.error(error);
      }
    },
    [currentUserRole, setUserData, userData._id],
  );

  const moveFolderToTrash = useCallback(
    async (folderId) => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/trash/folder/${folderId}/`,
          { userId: userData._id, currentUserRole },
        );

        setUserData(response.data.user);
      } catch (error) {
        console.error(error);
      }
    },
    [currentUserRole, setUserData, userData._id],
  );

  const handleTrashDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleTrashDrop = useCallback(
    (event) => {
      event.preventDefault();

      const fileId = event.dataTransfer.getData("fileId");
      const folderId = event.dataTransfer.getData("folderId");

      if (fileId) {
        moveFileToTrash(fileId);
      } else if (folderId) {
        moveFolderToTrash(folderId);
      }
    },
    [moveFileToTrash, moveFolderToTrash],
  );

  if (!currentTeam) {
    return (
      <div className="relative flex items-center justify-center h-screen w-full">
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div
        className="bg-gray-100 p-4 overflow-auto flex-shrink-0"
        style={{ flexBasis: "16.6667%", minWidth: "16.6667%" }}
      >
        <div className="flex justify-between items-center mb-4">
          <div
            onClick={() => handleLeaveTeamClick(true)}
            className="text-xl font-bold cursor-pointer"
          >
            {currentTeam.name}
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={handleTeamMemberClick}
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
          {currentTeam.ownedFolders.map((folder) => (
            <li
              key={folder._id}
              onDragStart={(event) => handleFolderDragStart(event, folder._id)}
              draggable="true"
              onClick={(event) =>
                handlePermissionClick(event, folder._id, "folder")
              }
              className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-200"
            >
              <span className="text-gray-700">📁 {folder.name}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleClickTrashBin}
          onDragOver={handleTrashDragOver}
          onDrop={handleTrashDrop}
          onDragStart={(event) => handleFileDragStart(event, "trash")}
          style={{ cursor: "pointer" }}
          draggable="true"
          className="block w-full mt-4 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          🗑️ 휴지통
        </button>
      </div>
      <div className="flex-grow p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/myteam")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            팀 목록
          </button>
          <button
            onClick={handleCreateFolderClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            폴더 생성하기
          </button>
        </div>
        <DropZone teamId={currentTeam._id} userId={userData._id} />
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="폴더 / 파일 명을 입력하세요"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className="block w-full px-3 py-2 border rounded-md mb-4"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                onDragStart={(event) =>
                  handleFolderDragStart(event, folder._id)
                }
                draggable="true"
                onClick={() => handleFolderClick(folder._id, folder.visibleTo)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleFolderDrop(event, folder._id)}
                className="group relative cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:scale-105 bg-white"
              >
                <span className="text-gray-600 block text-lg font-medium truncate">
                  📁 {folder.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                className="group relative cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:scale-105 bg-white"
              >
                <div
                  onClick={() => handleFileClick(file._id)}
                  onDragStart={(event) => handleFileDragStart(event, file._id)}
                  draggable="true"
                >
                  <img
                    src={getFileIconUrl(file.type)}
                    alt={file.type}
                    className="w-12 h-12 mb-2 transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className="text-gray-600 block text-lg font-medium truncate">
                    {file.name.length > 20
                      ? `${file.name.substring(0, 20)}...`
                      : file.name}
                  </span>
                  <DocViewerWrapper file={file} />
                </div>
                {selectedFile === file._id && (
                  <div className="absolute top-0 right-0 flex flex-col items-end space-y-2 p-2 bg-white rounded-lg shadow-lg">
                    <button
                      onClick={() =>
                        handleDownloadFile(
                          teamId,
                          file._id,
                          file.name,
                          currentUserRole,
                        )
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      다운로드
                    </button>
                    <button
                      onClick={() => handleViewDetails(file)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      자세히 보기
                    </button>
                    <button
                      onClick={(event) =>
                        handlePermissionClick(event, file._id, "file")
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      권한 설정
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-sm text-blue-600 hover:underline"
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
        <FileDetail
          setFileDetailOpen={setFileDetailOpen}
          file={selectedFile}
          currentUserRole={currentUserRole}
        />
      )}
      {isPermissionModalOpen && (
        <PermissionSetting
          setPermissionModalOpen={setPermissionModalOpen}
          selectedElementId={selectedElementId}
          selectedType={selectedType}
          currentUserRole={currentUserRole}
          clickPosition={clickPosition}
        />
      )}
      {isFolderAccessModalOpen && (
        <FolderAccess setFolderAccessModalOpen={setFolderAccessModalOpen} />
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

export default Team;
