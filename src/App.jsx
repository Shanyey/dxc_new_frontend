import "./App.css";
<<<<<<< HEAD
=======
import LoginPage from "./pages/LoginPage/LoginPage";
import ResetPage from "./pages/ResetPage/ResetPage";
>>>>>>> a87b7880a06c276745d3e2fee893d602576bf210
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Home from "./pages/HomePage/HomePage";

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
=======
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPage />} />
>>>>>>> a87b7880a06c276745d3e2fee893d602576bf210
      </Routes>
    </Router>
  );
}

export default App;
