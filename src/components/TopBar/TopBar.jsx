import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TopBar.css";
import SettingsIcon from "../../assets/icons/settings.png";
import UserManual from "../../assets/icons/user-manual.png";
import DXCLogo from "../../assets/dxc-brand.png";
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

  const location = useLocation();
  const basePath = location.pathname.replace(/\/$/, "");

  // Set initial selected item based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/batchfilequery")) {
      setSelectedItem("Batch File Query");
    } else if (path.includes("/AIRA")) {
      setSelectedItem("AIRA");
    } else if (path.includes("/RAG")) {
      setSelectedItem("RAG");
    } else if (path.includes("/chat")) {
      setSelectedItem("Real-Time Web Search Chat");
    } else {
      setSelectedItem("Home");
    }
  }, [location]);

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

            {/*To add on whenever there are new features*/}
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Home" href="/home">
                Home
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
              <Dropdown.Item eventKey="Real-Time Web Search Chat" href="/chat">
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
            <a href="/userguide">User Guide</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
