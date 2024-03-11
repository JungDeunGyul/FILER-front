import axios from "axios";

export function CreateTeam({ setCreateTeamModalOpen }) {
  const handleCloseModals = () => {
    setCreateTeamModalOpen(false);
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50 flex items-center justify-center">
      <button onClick={handleCloseModals}>나가기</button>
    </div>
  );
}
