import { useNavigate } from "react-router-dom";

import { useLeaveTeam } from "../../utils/api/leaveTeam";

export function LeaveTeam({
  setLeaveTeamModalOpen,
  currentTeam,
  queryClient,
  userData,
}) {
  const navigate = useNavigate();

  const leaveTeamMutation = useLeaveTeam(queryClient, navigate);

  const currentUser = currentTeam.members.find(
    (user) => user.user.nickname === userData.nickname,
  );

  const currentUserRole = currentUser.role;
  const teamName = currentTeam.name;

  const handleLeaveTeamConfirm = () => {
    const userId = userData._id;
    const teamId = currentTeam._id;

    leaveTeamMutation.mutate({ teamId, userId, currentUserRole });
  };

  const handleLeaveTeamCancel = () => {
    setLeaveTeamModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded flex flex-col items-center">
        <p className="text-lg font-semibold mb-4">
          {currentUserRole === "팀장"
            ? `${teamName}팀을 삭제하시겠습니까?`
            : `${teamName}팀에서 탈퇴하시겠습니까?`}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleLeaveTeamConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            예
          </button>
          <button
            onClick={handleLeaveTeamCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
