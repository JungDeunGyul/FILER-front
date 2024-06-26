import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import ExploreTeam from "./ExploreTeam";
import MyTeam from "./MyTeam";
import Login from "./Login";
import Team from "./Team";
import Folder from "./Folder";
import TrashBin from "./TrashBin";

import useUserStore from "./store/userData";

function App() {
  const { userData } = useUserStore();

  return (
    <div>
      <div className="flex flex-col h-screen overflow-hidden">
        {userData && <Header />}
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
