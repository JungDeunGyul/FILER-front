import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { useLoginUser } from "../../utils/api/auth";

import ImagePlaceholder from "../../components/ImagePlaceholder";

function Login({ setUserId }) {
  const navigate = useNavigate();
  const loginUserMutation = useLoginUser(navigate, setUserId);

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    loginUserMutation.mutate({
      email: result.user.email,
      nickname: result.user.displayName,
      photoURL: result.user.photoURL,
      token,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <ImagePlaceholder src="/FilerLoGo.png" alt="logo" />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        onClick={handleLogin}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
