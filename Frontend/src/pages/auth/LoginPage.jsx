import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import axios from "axios";


const LoginPage = () => {
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();

        axios.post("http://localhost:8000/api/auth/login", {username: userName, password})
        .then(result => {
            console.log(result);

            if(result.data && result.data.token) {
                localStorage.setItem("token", result.data.token);
                navigate("/dashboard")
            } else {
                console.log("Token not found in response");
            }
        })
        .catch(err => console.log(err));
      };

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
        <p>Study Creator helps you design in easy way.</p>
        <p>Start building your study today!</p> 
      </div>
     
      <div className="right-container">
        <div className="auth-card">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="userName">Username</label>
            <div className="input-group">
              <input 
                type="text" 
                name="userName" 
                placeholder="Username"
                required 
                onChange={(e) => setuserName(e.target.value)}
                />
            </div>

            <div className="input-group">
            <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                required
                onChange={(e) => setPassword(e.target.value)}
                />
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