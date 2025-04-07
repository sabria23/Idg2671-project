// import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Auth.css";

const LoginPage = () => {
    // const [formData, setFormData] = useState({
    //     userName: "",
    //     password: "",
    //     rememberMe: false
    // });
  return (
    <div className="auth-container">
        <div className="bubble-container">
            
        </div>
        
      <div className="left-container">
        <div className="bubble">
                <span style={{"--i": "41s" }}></span>
                <span style={{"--i": "22s" }}></span>
                <span style={{"--i": "53s" }}></span>
                <span style={{"--i": "44s" }}></span>
                <span style={{"--i": "55s" }}></span>
                <span style={{"--i": "76s" }}></span>
                <span style={{"--i": "57s" }}></span>
                <span style={{"--i": "30s" }}></span>
                <span style={{"--i": "85s" }}></span>
                <span style={{"--i": "90s" }}></span>
                <span style={{"--i": "31s" }}></span>
                <span style={{"--i": "95s" }}></span>
            </div>
        <h1>Welcome</h1>
        <h2>to the study creator</h2>
        <p>Create, analyze your studies with ease.</p>
        <p>Whether it's for research, surveys or learning materials</p>
        <p>Study Creator helps you design på en enkel måte.</p>
        <p>Start building your study today!</p>
      </div>
      <div className="right-container">
        <div className="auth-card">
          <h1>Login</h1>
          <form>
            <label for="userName">Username</label>
            <div className="input-group">
              <input type="text" name="userName" placeholder="Username" required />
            </div>

            <div className="input-group">
            <label for="password">Password</label>
              <input type="password" name="password" placeholder="Password" required />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" name="rememberMe" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-button">
              Login
            </button>

            <div className="auth-redirect">
              <p>
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;