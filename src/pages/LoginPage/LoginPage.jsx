import React, { useState } from "react";
import "./LoginPage.css";
import DXCLogo from "../../assets/dxc-brand.png";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email} \n password: ${password}`); //TO BE REMOVED
  };

  return (
    <div className="login-background">
      <div className="wrapper">
        <img src={DXCLogo} className="logo" alt="DXC Logo" />
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <FaLock className="icon" />
          </div>
          <div className="forgot-password">
            <Link to="/reset">Forgot Password?</Link>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
