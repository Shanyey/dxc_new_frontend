import "./App.css";
import LoginPage from "./pages/LoginPage/LoginPage";
import ResetPage from "./pages/ResetPage/ResetPage";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import BFQPage from "./pages/BatchFileQueryPage/BFQPage"
import RAGPage from "./pages/RAG/RAG"
import CVAnalyser from "./pages/CV/CVAnalyserPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/batchfilequery" element={<BFQPage />} />
        <Route path="/RAG" element={<RAGPage />} />
        <Route path="/cv" element={<CVAnalyser />} />
      </Routes>
    </Router>
  );
}

export default App;
