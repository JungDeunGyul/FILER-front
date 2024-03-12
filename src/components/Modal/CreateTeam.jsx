import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUserStore from "../store/userData";

export function CreateTeam({ setCreateTeamModalOpen }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createTeamInputRef = useRef(null);
  const navigate = useNavigate();

  const { userData, setUserData } = useUserStore();

  const handleCloseModals = () => {
    setCreateTeamModalOpen(false);
  };

  const handleChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const teamName = createTeamInputRef.current.value;
      console.log(teamName);
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

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/team/${teamName}/new/${
          userData._id
        }`,
      );

      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage("");
          setCreateTeamModalOpen(false);
          setUserData(response.data.updatedUser);
          navigate("/myteam");
        }, 3000);
      }
    } catch (error) {
      if (error.response.status === 404) {
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
            만들 팀 이름을 입력해주세요
          </label>
          <input
            ref={createTeamInputRef}
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
            생성하기
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
