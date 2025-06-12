import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TopBar.css";
import SettingsIcon from "../../assets/icons/settings.png";
import UserManual from "../../assets/icons/user-manual.png";
import DXCLogo from "../../assets/dxc-black.png";
import Dropdown from "react-bootstrap/Dropdown";
import { useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
//temporary, installed once done with firebase
/* import { auth } from "../../../../dxc_frontend_dev/src/Firebase"; */

function TopBar() {
  /*  const auth = getAuth(); */
  const [selectedItem, setSelectedItem] = useState("Home");

  const handleSignOut = () => {
    console.log("user signed out");
    // try {
    //   signOut(auth);
    //   console.log("user signed out");
    // } catch {
    //   console.error("error signing out");
    // }
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  return (
    <div className="home-page">
      <div className="header p-3">
        <div className="DXC_Logo">
          <img
            src={DXCLogo}
            alt="DXC Logo"
            className="logo"
            style={{ maxHeight: "100px" }}
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
              <Dropdown.Item eventKey="Home" href="/chat">
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
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="general">
          <a href={"/"} onClick={handleSignOut} className="wide-link">
            <img src={SettingsIcon} alt="Settings" className="img-fluid" />
            Sign Out
          </a>
          <a href="/userguide" className="wide-link">
            <img src={UserManual} alt="User Guide" className="img-fluid" />
            User Guide
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
