import React, { useState } from "react";
import "./ResetPage.css";
import DXCLogo from "../../assets/dxc-brand.png";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../services/Firebase";

function ResetPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      console.log(`Reset email sent to: ${email}`);
      alert("If this email is registered, a reset link has been sent.");
      setEmail(""); // Clear the input field after submission
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("Invalid email address. Please enter a valid email.");
      }
      console.error(`ERROR: ${error.message}`);
    }
  };

  return (
    <div className="reset-background">
      <div className="wrapper">
        <img src={DXCLogo} className="logo" alt="DXC Logo" />
        <form onSubmit={handleSubmit}>
          <h1>Reset Password</h1>
          <div className="prompt">
            Please enter a valid email address. If you do not receive an email,
            please check your spam folder.
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
            <Link to="/" replace>
              Return to Login
            </Link>
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
