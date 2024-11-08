import { useState, Dispatch, SetStateAction } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useUpdateTeamMembers } from "@api/updateTeamMembers";

import type { User, Teams } from "userRelatedTypes";

interface ManageTeamMembersProps {
  setManageTeamMemberModalOpen: Dispatch<SetStateAction<boolean>>;
  currentTeam: Teams;
  currentUserRole: string;
  queryClient: QueryClient;
  userData: User;
}

interface Member {
  _id: string;
  user: User;
  role: string;
}

export function ManageTeamMembers({
  setManageTeamMemberModalOpen,
  currentTeam,
  currentUserRole,
  queryClient,
  userData,
}: ManageTeamMembersProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const createFolderMutation = useUpdateTeamMembers({
    queryClient,
    setErrorMessage,
    setSuccessMessage,
    setManageTeamMemberModalOpen,
  });

  const handlePermissionSettingButton = (
    event: React.MouseEvent<HTMLButtonElement>,
    selectedRole: string,
  ) => {
    event.preventDefault();

    if (!selectedMember) {
      return;
    }

    if (currentUserRole !== "팀장") {
      setErrorMessage("팀장 이외에는 권한 설정 권한이 없습니다.");

      return setTimeout(() => {
        setErrorMessage("");
        setManageTeamMemberModalOpen(false);
      }, 2000);
    }

    const userId = userData._id;
    const selectedMemberId = selectedMember.user._id;
    const teamId = currentTeam._id;

    createFolderMutation.mutate({
      selectedMemberId,
      currentUserRole,
      selectedRole,
      teamId,
      userId,
    });
  };

  const handleCloseButton = () => {
    setManageTeamMemberModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">팀원 관리</h2>
          <button
            onClick={handleCloseButton}
            className="text-gray-600 hover:text-gray-800"
          >
            닫기
          </button>
        </div>
        <div className="grid gap-4">
          {currentTeam.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center border rounded-md p-2"
              onClick={() => setSelectedMember(member)}
            >
              <img
                src={member.user.iconpath}
                className="rounded-full h-8 w-8 mr-4"
                alt="user icon"
              />
              <div className="flex-grow">
                <p className="font-semibold">{member.user.nickname}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
              {selectedMember && selectedMember._id === member._id && (
                <div>
                  <button
                    onClick={(event) =>
                      handlePermissionSettingButton(event, "팀장")
                    }
                    className="text-sm text-gray-500 hover:text-gray-800 mr-2"
                  >
                    팀장
                  </button>
                  <button
                    onClick={(event) =>
                      handlePermissionSettingButton(event, "팀원")
                    }
                    className="text-sm text-gray-500 hover:text-gray-800 mr-2"
                  >
                    팀원
                  </button>
                  <button
                    onClick={(event) =>
                      handlePermissionSettingButton(event, "수습")
                    }
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    수습
                  </button>
                </div>
              )}
            </div>
          ))}
          {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
          {successMessage && (
            <p className="text-blue-500 mb-2">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
