import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../Sidebar";
import FileGrid from "../FileGrid";
import FolderGrid from "../FolderGird";
import FolderAndTeamListButtons from "../FolderAndTeamListButtons";

import { CreateFolder } from "../Modal/CreateFolder";
import { LeaveTeam } from "../Modal/LeaveTeam";
import { FileDetail } from "../Modal/FileDetail";
import { PermissionSetting } from "../Modal/PermissionSetting";
import { FolderAccess } from "../Modal/FolderAccess";
import { ManageTeamMembers } from "../Modal/ManageTeamMembers";

import { handleDownloadFile } from "../../utils/downloadFile";

import DropZone from "../DropZone";
import useUserStore from "../store/userData";

import axios from "axios";

function Folder() {
  const { userData, setUserData } = useUserStore();
  const { teamId, folderId } = useParams();
  const navigate = useNavigate();

  const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [isLeaveTeamModalOpen, setLeaveTeamModalOpen] = useState(false);
  const [isFileDetailOpen, setFileDetailOpen] = useState(false);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [isFolderAccessModalOpen, setFolderAccessModalOpen] = useState(false);
  const [isManageTeamMemberModalOpen, setManageTeamMemberModalOpen] =
    useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [folderData, setFolder] = useState([]);
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

  useEffect(() => {
    if (currentTeam) {
      getData();
    }
  }, [currentTeam, folderId]);

  const getData = async () => {
    const currentUser = currentTeam.members.find(
      (user) => user.user.nickname === userData.nickname,
    );

    const currentUserRole = currentUser.role;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/folder/${folderId}/`,
        {
          data: { currentUserRole },
        },
      );

      setFolder(response.data.folder);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredFolders = useMemo(() => {
    return folderData && folderData.subFolders
      ? folderData.subFolders.filter((folder) =>
          folder.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];
  }, [folderData, filterValue]);

  const filteredFiles = useMemo(() => {
    return folderData && folderData.files
      ? folderData.files.filter((file) =>
          file.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];
  }, [folderData, filterValue]);

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
    [currentUserRole],
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

  const handlePermissionClick = (event, elementId, type) => {
    setSelectedElementId(elementId);
    setSelectedType(type);
    setPermissionModalOpen(true);
    setClickPosition({ x: event.clientX, y: event.clientY });
  };

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
      <Sidebar
        currentTeam={currentTeam}
        handleLeaveTeamClick={handleLeaveTeamClick}
        handleTeamMemberClick={handleTeamMemberClick}
        handlePermissionClick={handlePermissionClick}
        handleFolderDragStart={handleFolderDragStart}
        handleClickTrashBin={handleClickTrashBin}
        handleTrashDragOver={handleTrashDragOver}
        handleTrashDrop={handleTrashDrop}
        handleFileDragStart={handleFileDragStart}
      />
      <div className="flex-grow p-4 overflow-auto">
        <FolderAndTeamListButtons
          onNavigate={() => navigate("/myteam")}
          onCreateFolder={handleCreateFolderClick}
        />
        <DropZone
          teamId={currentTeam._id}
          userId={userData._id}
          folderId={folderId}
          setFolder={setFolder}
        />
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="폴더 / 파일 명을 입력하세요"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className="block w-full px-3 py-2 border rounded-md mb-4"
          />
          <FolderGrid
            filteredFolders={filteredFolders}
            handleFolderDragStart={handleFolderDragStart}
            handleFolderClick={handleFolderClick}
            handleFolderDrop={handleFolderDrop}
          />
          <FileGrid
            filteredFiles={filteredFiles}
            handleFileDragStart={handleFileDragStart}
            handleFileClick={handleFileClick}
            selectedFile={selectedFile}
            handleDownloadFile={handleDownloadFile}
            handleViewDetails={handleViewDetails}
            handlePermissionClick={handlePermissionClick}
            handleCancel={handleCancel}
            teamId={teamId}
            currentUserRole={currentUserRole}
          />
        </div>
      </div>
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <CreateFolder
            setCreateFolderModalOpen={setCreateFolderModalOpen}
            teamName={currentTeam.name}
            folderId={folderId}
            setFolder={setFolder}
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

export default Folder;
