import "./App.css";
import LoginPage from "./pages/LoginPage/LoginPage";
import ResetPage from "./pages/ResetPage/ResetPage";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Chat/Chat";
import BFQPage from "./pages/BatchFileQueryPage/BFQPage"
import RAGPage from "./pages/RAG/RAG"
import CVAnalyser from "./pages/CV/CVAnalyserPage"
import GradesAnalyser from "./pages/GradeAnalyser/GradesAnalyserPage"
// import AIRAInputQuery from "./pages/AIRA/AIRA_InputQuery";
// import AIRAAnalyseData from "./pages/AIRA/AIRA_AnalyseData";
// import AIRAGenerate from "./pages/AIRA/AIRA_Generate";
import VertexCoverSolver from './pages/qap/VertexCoverSolver';
import CliqueSolver from './pages/qap/CliqueSolver';
import TspSolver from './pages/qap/TspSolver';
import StableSetSolver from './pages/qap/StableSetSolver';
import ExactCoverSolver from './pages/qap/ExactCoverSolver';
import GraphPartitionSolver from './pages/qap/GraphPartitionSolver';
import MaxCutSolver from './pages/qap/MaxCutSolver';
import NumberPartitionSolver from './pages/qap/NumberPartitionSolver'
import KnapsackSolver from './pages/qap/KnapsackSolver'
import Home from './pages/qap/Home/Home';
import Docs from './pages/qap/Docs/Docs';
import QapFontWrapper from './components/qap/QapFontWrapper'

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
        {/* <Route path="/AIRA/input" element={<AIRAInputQuery />} />
        <Route path="/AIRA/analyse" element={<AIRAAnalyseData />} />
        <Route path="/AIRA/generate" element={<AIRAGenerate />} /> */}
        <Route path="/qap" element={<QapFontWrapper><Home/></QapFontWrapper>} />
        <Route path="/qap/clique-solver" element={<QapFontWrapper><CliqueSolver /></QapFontWrapper>}/>
        <Route path="/qap/vertex-cover-solver" element={<QapFontWrapper><VertexCoverSolver/></QapFontWrapper>} />
        <Route path="/qap/tsp-solver" element={<QapFontWrapper><TspSolver /></QapFontWrapper>} />
        <Route path="/qap/stable-set-solver" element={<QapFontWrapper><StableSetSolver /></QapFontWrapper>} />
        <Route path="/qap/exact-cover-solver" element={<QapFontWrapper><ExactCoverSolver /></QapFontWrapper>} />
        <Route path="/qap/graph-partition-solver" element={<QapFontWrapper><GraphPartitionSolver /></QapFontWrapper>} />
        <Route path="/qap/max-cut-solver" element={<QapFontWrapper><MaxCutSolver /></QapFontWrapper>} />
        <Route path="/qap/number-partition-solver" element={<QapFontWrapper><NumberPartitionSolver /></QapFontWrapper>} />
        <Route path="/qap/knapsack-solver" element={<QapFontWrapper><KnapsackSolver /></QapFontWrapper>} />   
        <Route path="/qap/docs" element={<QapFontWrapper><Docs /></QapFontWrapper>} />  
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
