import React, { useState } from "react";
import "./ResetPage.css";
import DXCLogo from "../../assets/dxc-brand.png";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function ResetPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}`); //TO BE REMOVED
  };

  return (
    <div className="reset-background">
      <div className="wrapper">
        <img src={DXCLogo} className="logo" alt="DXC Logo" />
        <form onSubmit={handleSubmit}>
          <h1>Reset Password</h1>
          <div className="input-box">
            <p>
              Please enter a valid email address. If you do not receive an
              email, please check your spam folder.
            </p>
          </div>
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
          <div className="forgot-password">
            <Link to="/Login">Forgot Password?</Link>
          </div>
          <button type="submit" className="reset-button">
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPage;
