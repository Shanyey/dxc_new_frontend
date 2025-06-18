import "./App.css";
import LoginPage from "./pages/LoginPage/LoginPage";
import ResetPage from "./pages/ResetPage/ResetPage";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Chat/Chat";
import BFQPage from "./pages/BatchFileQueryPage/BFQPage";
import RAGPage from "./pages/RAG/RAG";
import CVAnalyser from "./pages/CV/CVAnalyserPage";
import GradesAnalyser from "./pages/GradeAnalyser/GradesAnalyserPage";
import AIRA from "./pages/AIRA/AIRA";
import Translation from "./pages/Translation/TranslationPage";
import VideoGeneration from "./pages/VideoGeneration/VideoGeneration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/chat" element={<HomePage />} />
        <Route path="/batchfilequery" element={<BFQPage />} />
        <Route path="/RAG" element={<RAGPage />} />
        <Route path="/cv" element={<CVAnalyser />} />
        <Route path="/gradesanalyser" element={<GradesAnalyser />} />
        <Route path="/AIRA" element={<AIRA />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/videogeneration" element={<VideoGeneration />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
