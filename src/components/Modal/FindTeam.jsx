import { useState, useRef } from "react";
import axios from "axios";
import useUserStore from "../store/userData";

export function FindTeam({ setFindTeamModalOpen }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const findTeamInputRef = useRef(null);

  const { userData } = useUserStore();

  const handleCloseModals = () => {
    setFindTeamModalOpen(false);
  };

  const handleChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const teamName = findTeamInputRef.current.value;

      if (
        teamName.length < 3 ||
        teamName.length > 10 ||
        /[!@#$%^&*(),.?":{}|<>]/.test(teamName)
      ) {
        setErrorMessage(
          "팀 이름은 3자 이상, 10자 이하이며 특수문자를 포함할 수 없습니다.",
        );
        return;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/team/${teamName}/joinrequest/${
          userData._id
        }`,
      );

      if (response.status === 200) {
        setSuccessMessage("신청이 성공적으로 완료되었습니다!");
        setTimeout(() => {
          setSuccessMessage("");
          setFindTeamModalOpen(false);
        }, 3000);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setErrorMessage(error.response.data.message);
        return;
      } else if (error.response.status === 412) {
        setErrorMessage(error.response.data.message);
        return;
      }

      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="fixed w-4/6 h-4/6 z-10 bg-gray flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-50 rounded-md items-center bg-white p-6">
          <label className="text-2xl font-bold mb-4">
            찾는 팀 이름을 입력해주세요
          </label>
          <input
            ref={findTeamInputRef}
            onChange={handleChange}
            className="border rounded-md p-3 mb-4 w-full"
          />
          <div className={`mb-10 h-32 overflow-hidden`}>
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-blue-500 mb-2">{successMessage}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-full bg-slate-900 text-white px-4 py-2"
          >
            신청하기
          </button>
          <button
            onClick={handleCloseModals}
            className="rounded-md bg-gray-300 text-gray-800 px-3 py-1 mt-2"
          >
            나가기
          </button>
        </div>
      </form>
    </div>
  );
}
