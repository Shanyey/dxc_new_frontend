import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TopBar.css";
import SettingsIcon from "../../assets/icons/settings.png";
import UserManual from "../../assets/icons/user-manual.png";
import DXCLogo from "../../assets/dxc-black.png";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

function TopBar() {
  const navigate = useNavigate();
  const pathToTool = {
    "/chat": "Chat",
    "/batchfilequery": "Batch File Query",
    "/AIRA": "AIRA",
    "/RAG": "RAG",
    "/cv": "CV Analyser",
    "/gradesanalyser": "Grades Analyser",
    "/translation": "Translation",
  };

  const currentPath = window.location.pathname;
  const [selectedItem, setSelectedItem] = useState(pathToTool[currentPath] || "Chat");

  const handleSignOut = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    try {
      await signOut(auth);
      console.log(`user ${user?.email} signed out`);
    } catch {
      console.log(`user ${user?.email} error signing out`);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  return (
    <div className="home-page">
      <div
        className="header p-3"
      >
        <div className="left-group">
          <div className="DXC_Logo">
            <img
              src={DXCLogo}
              alt="DXC Logo"
            />
          </div>
          <div className="dropdown">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="btn btn-primary"
              >
                Tools
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Chat" href="/chat">
                  Chat
                </Dropdown.Item>
                <Dropdown.Item eventKey="Batch File Query" href="/batchfilequery">
                  Batch File Query
                </Dropdown.Item>
                <Dropdown.Item eventKey="AIRA" href="/AIRA">
                  AIRA
                </Dropdown.Item>
                <Dropdown.Item eventKey="RAG" href="/RAG">
                  RAG
                </Dropdown.Item>
                <Dropdown.Item eventKey="CV Analyser" href="/cv">
                  CV Analyser
                </Dropdown.Item>
                <Dropdown.Item eventKey="Grades Analyser" href="/gradesanalyser">
                  Grades Analyser
                </Dropdown.Item>
                <Dropdown.Item eventKey="Translation" href="/translation">
                  Translation
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="indicator">
          {selectedItem}
        </div>
        <div className="general">
          <a href="/userguide" className="wide-link">
            <img src={UserManual} alt="User Guide" className="img-fluid" />
            User Guide
          </a>
          <a onClick={handleSignOut} className="wide-link">
            <img src={SettingsIcon} alt="Settings" className="img-fluid" />
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
