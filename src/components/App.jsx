import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import Home from "./Home";
import ExploreTeam from "./ExploreTeam";
import MyTeam from "./MyTeam";
import Login from "./Login";
import Team from "./Team";
import Folder from "./Folder";
import TrashBin from "./TrashBin";
import { fetchUserData } from "../utils/api/fetchUserData";

function App() {
  const [userId, setUserId] = useState(null);

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetchUserData(userId),
    enabled: !!userId,
    retry: false,
  });

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
