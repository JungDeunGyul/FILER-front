import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import useUserStore from "../store/userData";

import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const { setUserData } = useUserStore();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/login`,
        {
          user: {
            email: result.user.email,
            nickname: result.user.displayName,
            photoURL: result.user.photoURL,
          },
          token,
        },
        { withCredentials: true },
      );

      setUserData(res.data.user);
      navigate("/Home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src="/FilerLoGo.png" alt="logo" />
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={handleLogin}
        >
          Sign in With Google
        </button>
      </div>
    </div>
  );
}

export default Login;
