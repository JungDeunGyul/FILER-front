const Sidebar = ({
  currentTeam,
  filteredFolders,
  handleLeaveTeamClick,
  handleTeamMemberClick,
  handlePermissionClick,
  handleFolderDragStart,
  handleClickTrashBin,
  handleTrashDragOver,
  handleTrashDrop,
  handleFileDragStart,
}) => {
  return (
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
        {filteredFolders.map((folder) => (
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
  );
};

export default Sidebar;
