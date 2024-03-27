import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CreateFolder } from "../Modal/CreateFolder";
import { LeaveTeam } from "../Modal/LeaveTeam";
import { FileDetail } from "../Modal/FileDetail";
import { PermissionSetting } from "../Modal/PermissionSetting";
import { FolderAccess } from "../Modal/FolderAccess";
import { ManageTeamMembers } from "../Modal/ManageTeamMembers";

import { getFileIconUrl } from "../../utils/fileIconURL";
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
  const [hoveredFile, setHoveredFile] = useState(null);

  const [folderData, setFolder] = useState([]);
  const [currentUserRole, setUserRole] = useState("");
  const [currentTeam, setCurrentTeam] = useState(null);
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

  const filteredFolders =
    folderData && folderData.subFolders
      ? folderData.subFolders.filter((folder) =>
          folder.name.toLowerCase().includes(filterValue.toLowerCase()),
        )
      : [];

  const filteredFiles =
    folderData && folderData.files
      ? folderData.files.filter((file) =>
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

  const handlePermissionClick = (event, elementId, type) => {
    setSelectedElementId(elementId);
    setSelectedType(type);
    setPermissionModalOpen(true);
    setClickPosition({ x: event.clientX, y: event.clientY });
  };

  const handleTeamMemberClick = () => {
    setManageTeamMemberModalOpen(true);
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

  const handleMouseEnter = (file) => {
    setHoveredFile(file);
  };

  const handleMouseLeave = () => {
    setHoveredFile(null);
  };

  if (!currentTeam) {
    return <div>Loading...</div>;
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
          <div className="flex" onClick={() => handleTeamMemberClick()}>
            {currentTeam.members.slice(0, 3).map((user) => (
              <img
                key={user._id}
                src={user.user.iconpath}
                className="rounded-full ml-1 h-8 w-8"
                alt="user icon"
              />
            ))}
            {currentTeam.members.length > 3 && (
              <div className="flex">+{currentTeam.members.length - 3}</div>
            )}
          </div>
        </div>
        {folderData.subFolders &&
          folderData.subFolders.map((folder) => (
            <div
              key={folder._id}
              onClick={(event) =>
                handlePermissionClick(event, folder._id, "folder")
              }
              style={{ cursor: "pointer" }}
            >
              <p className="text-lg font-bold">📁 {folder.name}</p>
            </div>
          ))}
        <div
          onDragOver={handleTrashDragOver}
          onDrop={handleTrashDrop}
          style={{ cursor: "pointer" }}
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
          <DropZone
            teamId={currentTeam._id}
            userId={userData._id}
            folderId={folderId}
            setFolder={setFolder}
          />
          <div className="flex justify-between mr-5">
            <div className="font-semibold mt-2 ml-2">
              현재 폴더: {folderData.name}
            </div>
            <input
              type="text"
              placeholder="폴더 / 파일 명을 입력하세요"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="p-2 mt-4 ml-5 border"
            />
          </div>
          <p className="ml-2">폴 더</p>
          <div className="grid grid-cols-4 gap-6 m-4 p-2">
            {filteredFolders.map((folder) => (
              <div
                key={folder._id}
                onDragStart={(e) => handleFolderDragStart(e, folder._id)}
                draggable="true"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleFolderClick(folder._id, folder.visibleTo);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFolderDrop(e, folder._id)}
                className="bg-gray-300 p-7 m-1 border relative"
              >
                <p className="text-lg font-bold absolute top-1 left-2">
                  📁 {folder.name}
                </p>
              </div>
            ))}
          </div>
          <p className="ml-2">파 일</p>
          <div className="grid grid-cols-4 gap-6 m-4 p-2">
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                draggable="true"
                onDragStart={(e) => handleFileDragStart(e, file._id)}
                onMouseEnter={() => handleMouseEnter(file)}
                onMouseLeave={handleMouseLeave}
                className="bg-gray-300 p-7 m-1 border relative flex flex-col"
              >
                <div
                  onClick={() => handleFileClick(file._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <img
                      src={getFileIconUrl(file.type)}
                      alt={file.type}
                      className="absolute top-1 left-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    <p className="text-lg font-bold absolute">
                      {file.name.length > 20
                        ? `${file.name.substring(0, 20)}...`
                        : file.name}
                    </p>
                  </div>
                </div>
                {selectedFile === file._id && (
                  <div className="file-options mt-2 absolute top-full left-0">
                    <button
                      onClick={() =>
                        handleDownloadFile(
                          teamId,
                          file._id,
                          file.name,
                          currentUserRole,
                        )
                      }
                      className="bg-blue-500 text-white px-1 py-1 rounded mr-2"
                    >
                      다운로드
                    </button>
                    <button
                      onClick={() => handleViewDetails(file)}
                      className="bg-green-500 text-white px-1 py-1 rounded mr-2"
                    >
                      자세히 보기
                    </button>
                    <button
                      onClick={(event) =>
                        handlePermissionClick(event, file._id, "file")
                      }
                      className="bg-gray-500 text-white px-1 py-1 rounded mr-2"
                    >
                      권한 설정
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-1 py-1 rounded"
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
            ))}
            {hoveredFile && (
              <div
                className="absolute bg-gray-500 text-white p-2 rounded"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <p className="mb-1">파일명: {hoveredFile.name}</p>
                <p className="mb-1">접근 권한: {hoveredFile.visibleTo} 이상</p>
                <p className="mb-1">업로드한 사람: {hoveredFile.uploadUser}</p>
                {(hoveredFile.type === "application/pdf" ||
                  hoveredFile.type === "image/jpeg" ||
                  hoveredFile.type === "image/png") && (
                  <iframe
                    src={hoveredFile.filePath}
                    className="w-full h-40"
                  ></iframe>
                )}
              </div>
            )}
          </div>
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
