import { useState } from "react";
import { CreateTeam } from "../Modal/CreateTeam";
import { FindTeam } from "../Modal/FindTeam";

function ExploreTeam() {
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [isFindTeamModalOpen, setFindTeamModalOpen] = useState(false);

  const handleCreateTeam = () => {
    setCreateTeamModalOpen(true);
  };

  const handleFindTeam = () => {
    setFindTeamModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border w-4/6 h-4/6 flex justify-between items-center">
        <button className="px-24 py-24 text-6xl" onClick={handleCreateTeam}>
          Create Team?
        </button>

        <button className="px-24 py-24 text-6xl" onClick={handleFindTeam}>
          Find Team?
        </button>
      </div>

      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <CreateTeam setCreateTeamModalOpen={setCreateTeamModalOpen} />
        </div>
      )}

      {isFindTeamModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <FindTeam setFindTeamModalOpen={setFindTeamModalOpen} />
        </div>
      )}
    </div>
  );
}

export default ExploreTeam;
