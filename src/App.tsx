import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@layout/Header";
import Home from "@pages/Home";
import ExploreTeam from "@pages/ExploreTeam";
import MyTeam from "@pages/MyTeam";
import Login from "@pages/Login";
import Team from "@pages/Team";
import Folder from "@pages/Folder";
import TrashBin from "@pages/TrashBin";
import { fetchUserData } from "@api/fetchUserData";

import type { User } from "userRelatedTypes";

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: userData } = useQuery<User>({
    queryKey: ["userData"],
    queryFn: () => fetchUserData(userId as string),
    enabled: !!userId,
    retry: false,
  });

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem("lastVisitedURL", location.pathname);
    }
  }, [location, userId]);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedURL = sessionStorage.getItem("lastVisitedURL");

    if (storedUserId) {
      if (storedURL) {
        navigate(storedURL);
      } else {
        navigate("/home");
      }
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col h-screen overflow-hidden">
        {userData && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              userData ? (
                <Navigate to="/home" />
              ) : (
                <Login setUserId={setUserId} />
              )
            }
          />
          <Route
            path="/home"
            element={userData ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/exploreteam"
            element={userData ? <ExploreTeam /> : <Navigate to="/" />}
          />
          <Route
            path="/myteam"
            element={userData ? <MyTeam /> : <Navigate to="/" />}
          />
          <Route
            path="/team/:teamId"
            element={userData ? <Team /> : <Navigate to="/" />}
          />
          <Route
            path="/team/:teamId/folder/:folderId"
            element={userData ? <Folder /> : <Navigate to="/" />}
          />
          <Route
            path="/team/:teamId/trash"
            element={userData ? <TrashBin /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
