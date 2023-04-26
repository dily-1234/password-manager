import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Gen from "./components/Generator";
import Checker from "./components/Checker";
import Settings from "./components/Settings";
import FaceCompare from "./components/FaceCompare";

function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/facialrecognition" element={<FaceCompare />} />
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      {user && <Route path="/gen" exact element={<Gen />} />}
      {user && <Route path="/checker" exact element={<Checker />} />}
      {user && <Route path="/settings" exact element={<Settings />} />}
      <Route path="/*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
