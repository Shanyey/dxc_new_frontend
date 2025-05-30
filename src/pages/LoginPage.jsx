import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";

import "./LoginPage.css";
import DXCLogo from "../assets/dxc-brand.png";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <div className="wrapper">
      <img src={DXCLogo} className="logo" />
      <form action="" onSubmit={login}>
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
          <a href="https://www.google.com/">Forgot password?</a>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
