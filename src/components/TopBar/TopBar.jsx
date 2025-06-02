import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TopBar.css";
import SettingsIcon from "../../assets/settings.png";
import UserManual from "../../assets/user-manual.png";
import DXCLogo from "../../assets/dxc-brand.png";
import Dropdown from "react-bootstrap/Dropdown";
import { useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "../../../../dxc_frontend_dev/src/Firebase";

function TopBar() {
  const auth = getAuth();
  const [selectedItem, setSelectedItem] = useState("Home");

  const handleSignOut = () => {
    try {
      signOut(auth);
      console.log("user signed out");
    } catch {
      console.error("error signing out");
    }
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  const location = useLocation();
  const basePath = location.pathname.replace(/\/$/, "");

  return (
    <div className="home-page">
      <div className="header d-flex justify-content-between align-items-center p-3">
        <div className="DXC_Logo">
          <img
            src={DXCLogo}
            alt="DXC Logo"
            className="img-fluid"
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
              {selectedItem}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="Home" href="/home">
                Home
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="Batch File Query"
                href={`${basePath}/batchfilequery`}
              >
                Batch File Query
              </Dropdown.Item>
              <Dropdown.Item eventKey="AIRA" href={`${basePath}/AIRA`}>
                AIRA
              </Dropdown.Item>
              <Dropdown.Item eventKey="RAG" href={`${basePath}/RAG`}>
                RAG
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="Real-Time Web Search Chat"
                href={`${basePath}/chat`}
              >
                Real-Time Web Search Chat
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="general">
          <div>
            <img src={SettingsIcon} alt="Settings" className="img-fluid" />
            <a href={"/"} onClick={handleSignOut}>
              Sign Out
            </a>
          </div>
          <div>
            <img src={UserManual} alt="Settings" className="img-fluid" />
            <a href={`${basePath}/userguide`}>User Guide</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
