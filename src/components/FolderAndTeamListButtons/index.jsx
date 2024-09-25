const FolderAndTeamListButtons = ({ onNavigate, onCreateFolder }) => (
  <div className="flex justify-between items-center mb-4">
    <button
      onClick={onNavigate}
      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
    >
      팀 목록
    </button>
    <button
      onClick={onCreateFolder}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      폴더 생성하기
    </button>
  </div>
);

export default FolderAndTeamListButtons;
