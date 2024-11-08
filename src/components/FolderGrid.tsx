import type { OwnedFolder } from "userRelatedTypes";

interface FolderGridProps {
  filteredFolders: OwnedFolder[];
  handleFolderDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    folderId: string,
  ) => void;
  handleFolderClick: (folderId: string, visibleTo: string) => void;
  handleFolderDrop: (
    event: React.DragEvent<HTMLDivElement>,
    folderId: string,
  ) => void;
}

const FolderGrid = ({
  filteredFolders,
  handleFolderDragStart,
  handleFolderClick,
  handleFolderDrop,
}: FolderGridProps) => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {filteredFolders.map((folder: OwnedFolder) => (
        <div
          role="folder"
          key={folder._id}
          draggable="true"
          onDragStart={(event) => handleFolderDragStart(event, folder._id)}
          onClick={() => {
            handleFolderClick(folder._id, folder.visibleTo);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleFolderDrop(event, folder._id)}
          className="group relative cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:scale-105 bg-white"
        >
          <span className="text-gray-600 block text-lg font-medium truncate">
            📁 {folder.name}
          </span>
        </div>
      ))}
    </section>
  );
};

export default FolderGrid;
