import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import ExploreTeam from "./ExploreTeam";
import MyTeam from "./MyTeam";
import Login from "./Login";
import Team from "./Team";
import Folder from "./Folder";

import useUserStore from "./store/userData";

function App() {
  const { userData } = useUserStore();

  return (
    <div>
      <div className="w-full h-full">
        {userData && <Header className="fixed top-0 left-0" />}
        <Routes>
          <Route
            path="/"
            element={userData ? <Navigate to="/home" /> : <Login />}
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
