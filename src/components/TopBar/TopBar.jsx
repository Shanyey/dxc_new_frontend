import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TopBar.css";
import SettingsIcon from "../../assets/icons/settings.png";
import UserManual from "../../assets/icons/user-manual.png";
import DXCLogo from "../../assets/dxc-black.png";
import Dropdown from "react-bootstrap/Dropdown";
import routes from "./routes.jsx";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

function TopBar() {
  const navigate = useNavigate();

  // Create path-to-label mapping
  const pathToTool = Object.fromEntries(routes.map(route => [route.path, route.label]));

  const currentPath = window.location.pathname;
  const [selectedItem, setSelectedItem] = useState(pathToTool[currentPath] || toolRoutes[0].label);

  const [selectedModel, setSelectedModel] = useState("GPT-4o-mini");

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

  const handleSelectFeature = (eventKey) => {
    setSelectedItem(eventKey);
  };

  const handleSelectModel = (eventKey) => {
    setSelectedModel(eventKey);
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
            <Dropdown onSelect={handleSelectFeature}>
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="btn btn-primary"
              >
                Tools
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {routes.map(route => (
                  <Dropdown.Item eventKey={route.label} href={route.path} key={route.path}>
                    {route.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Dropdown onSelect={handleSelectModel}>
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                className="btn btn-primary"
              >
                {selectedModel}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="GPT-4o-mini">GPT-4o-mini</Dropdown.Item>
                <Dropdown.Item eventKey="GPT-4">GPT-4</Dropdown.Item>
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
