import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Home from "../components/Home";

function App() {
  return (
    <div>
      <div className="w-full h-full">
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/home" exact element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
