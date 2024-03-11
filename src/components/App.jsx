import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../components/Home";
import ExploreTeam from "../components/ExploreTeam";
import MyTeam from "../components/MyTeam";
import Login from "../components/Login";
import useUserStore from "./store/userData";

function App() {
  const { userData } = useUserStore();

  return (
    <div>
      <div className="w-full h-full">
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
