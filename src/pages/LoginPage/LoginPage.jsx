import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import DXCLogo from "../../assets/dxc-brand.png";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate, Link, replace } from "react-router-dom";
//import { auth } from "../../../../dxc_frontend_dev/src/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/chat", { replace: true });
    // try {
    //   const userCredentials = signInWithEmailAndPassword(auth, email, password);
    //   const user = userCredentials.user;
    //   setUserInfo({
    //     userDetails: user.displayName,
    //     userImage: user.photoURL,
    //     userMail: user.email,
    //   });
    // } catch (error) {
    //   console.log(error.code, error.message);
    // }
  };

  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     console.log(user);
  //     if (user != null) {
  //       navigate("/home", { replace: true });
  //     }
  //   });
  // }, []);

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
              //required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              //required
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
