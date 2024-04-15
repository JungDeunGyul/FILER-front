import React, { useState } from "react";
import useUserStore from "../store/userData";
import axios from "axios";

export function ManageTeamMembers({
  setManageTeamMemberModalOpen,
  currentTeam,
  currentUserRole,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const { userData, setUserData } = useUserStore();

  const handlePermissionSettingButton = async (event, selectedRole) => {
    event.preventDefault();

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

    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/team/${selectedMemberId}/manageteam/`,
        { currentUserRole, selectedRole, teamId, userId },
      );

      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage("");
          setUserData(response.data.currentUser);
          setManageTeamMemberModalOpen(false);
        }, 2000);
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => {
          setErrorMessage("");
          setManageTeamMemberModalOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
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
