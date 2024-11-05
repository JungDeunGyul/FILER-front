import React, { useState, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { LeaveTeam } from "../../components/modal/LeaveTeam";
import { FileDetail } from "../../components/modal/FileDetail";
import { CreateFolder } from "../../components/modal/CreateFolder";
import { FolderAccess } from "../../components/modal/FolderAccess";
import { PermissionSetting } from "../../components/modal/PermissionSetting";
import { ManageTeamMembers } from "../../components/modal/ManageTeamMembers";

import { handleDownloadFile } from "../../utils/downloadFile";

import { useMoveFolderToTrash } from "../../utils/api/moveFolderToTrash";
import { useMoveFileToTrash } from "../../utils/api/moveFileToTrash";
import { useMoveFileToFolder } from "../../utils/api/moveFileToFolder";

import { useCurrentTeam } from "../../utils/hook/useCurrentTeam";
import { useScrollHandler } from "../../utils/hook/useScrollHandler";

import Sidebar from "../../components/layout/Sidebar";
import FileGrid from "../../components/layout/FileGrid";
import DropZone from "../../components/DropZone";
import FolderGrid from "../../components/layout/FolderGrid";
import FolderAndTeamListButtons from "../../components/FolderAndTeamListButtons";

function Team() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["userData"]);
  const { teamId } = useParams();

  const moveFileToTrashMutation = useMoveFileToTrash(queryClient);
  const moveFolderToTrashMutation = useMoveFolderToTrash(queryClient);
  const moveFileToFolderMutation = useMoveFileToFolder(queryClient);

  const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [isLeaveTeamModalOpen, setLeaveTeamModalOpen] = useState(false);
  const [isFileDetailOpen, setFileDetailOpen] = useState(false);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const [isFolderAccessModalOpen, setFolderAccessModalOpen] = useState(false);
  const [isManageTeamMemberModalOpen, setManageTeamMemberModalOpen] =
    useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedElementId, setSelectedElementId] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [filesToShow, setFilesToShow] = useState(12);
  const scrollContainerRef = useRef(null);

  const { currentTeam, currentUserRole } = useCurrentTeam(userData, teamId);
  useScrollHandler(scrollContainerRef, setFilesToShow);

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

  const handleFolderDrop = useCallback(
    async (event, folderId) => {
      event.preventDefault();

      const fileId = event.dataTransfer.getData("fileId");

      moveFileToFolderMutation.mutate({
        fileId,
        folderId,
        userId: userData._id,
        currentUserRole,
      });
    },
    [currentUserRole, moveFileToFolderMutation, userData._id],
  );

  const handleClickTrashBin = () => {
    navigate(`/team/${encodeURIComponent(currentTeam._id)}/trash`);
  };

  const handleTrashDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleTrashDrop = (event) => {
    event.preventDefault();

    const fileId = event.dataTransfer.getData("fileId");
    const folderId = event.dataTransfer.getData("folderId");

    if (fileId) {
      moveFileToTrashMutation.mutate({
        fileId,
        userId: userData._id,
        currentUserRole,
      });
    } else if (folderId) {
      moveFolderToTrashMutation.mutate({
        folderId,
        userId: userData._id,
        currentUserRole,
      });
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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar
        currentTeam={currentTeam}
        filteredFolders={filteredFolders}
        handleLeaveTeamClick={handleLeaveTeamClick}
        handleTeamMemberClick={handleTeamMemberClick}
        handlePermissionClick={handlePermissionClick}
        handleFolderDragStart={handleFolderDragStart}
        handleClickTrashBin={handleClickTrashBin}
        handleTrashDragOver={handleTrashDragOver}
        handleTrashDrop={handleTrashDrop}
        handleFileDragStart={handleFileDragStart}
      />
      <div ref={scrollContainerRef} className="flex-grow p-4 overflow-auto">
        <FolderAndTeamListButtons
          onNavigate={() => navigate("/myteam")}
          onCreateFolder={handleCreateFolderClick}
        />
        <DropZone teamId={currentTeam._id} userId={userData._id} />
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
            filteredFiles={filteredFiles.slice(0, filesToShow)}
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
            queryClient={queryClient}
            userData={userData}
          />
        </div>
      )}
      {isLeaveTeamModalOpen && (
        <LeaveTeam
          setLeaveTeamModalOpen={setLeaveTeamModalOpen}
          currentTeam={currentTeam}
          queryClient={queryClient}
          userData={userData}
        />
      )}
      {isFileDetailOpen && (
        <FileDetail
          setFileDetailOpen={setFileDetailOpen}
          file={selectedFile}
          currentUserRole={currentUserRole}
          teamId={teamId}
          queryClient={queryClient}
          userData={userData}
        />
      )}
      {isPermissionModalOpen && (
        <PermissionSetting
          setPermissionModalOpen={setPermissionModalOpen}
          selectedElementId={selectedElementId}
          selectedType={selectedType}
          currentUserRole={currentUserRole}
          clickPosition={clickPosition}
          queryClient={queryClient}
          userData={userData}
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
          queryClient={queryClient}
          userData={userData}
        />
      )}
    </div>
  );
}

export default Team;
