import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CreateFolder } from "../Modal/CreateFolder";
import { LeaveTeam } from "../Modal/LeaveTeam";
import { FileDetail } from "../Modal/FileDetail";

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

  const [folderData, setFolder] = useState([]);
  const [currentUserRole, setUserRole] = useState("");
  const [currentTeam, setCurrentTeam] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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

  if (!currentTeam) {
    return <div>Loading...</div>;
  }

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

  const handleFolderClick = (folderId) => {
    navigate(
      `/team/${encodeURIComponent(currentTeam._id)}/folder/${encodeURIComponent(
        folderId,
      )}`,
    );
  };

  const handleCreateFolderClick = () => {
    setCreateFolderModalOpen(true);
  };

  const handleLeaveTeamClick = () => {
    setLeaveTeamModalOpen(true);
  };

  const handleFileClick = (fileId) => {
    setSelectedFile(fileId);
  };

  const handleViewDetails = (file) => {
    setSelectedFile(file);
    setFileDetailOpen(true);
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  const handleFileDragStart = (event, fileId) => {
    event.dataTransfer.setData("fileId", fileId);
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
        {folderData.subFolders &&
          folderData.subFolders.map((folder) => (
            <div
              key={folder._id}
              onClick={() => handleFolderClick(folder._id)}
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
          <DropZone
            teamId={currentTeam._id}
            userId={userData._id}
            folderId={folderId}
            setFolder={setFolder}
          />
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
            {filteredFolders &&
              filteredFolders.map((folder) => (
                <div
                  key={folder._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleFolderClick(folder._id);
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
          <p>파 일</p>
          <div className="grid grid-cols-4 gap-6 m-2 p-2">
            {filteredFiles &&
              filteredFiles.map((file) => (
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
                          handleDownloadFile(teamId, file._id, file.name)
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
            teamName={currentTeam}
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
    </div>
  );
}

export default Folder;
