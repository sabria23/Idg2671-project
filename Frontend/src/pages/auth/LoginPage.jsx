import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import { loginUser } from "../../services/authService.js";



const LoginPage = () => {
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!username || !password) {
          setError("Please fill out both fields.");
          setLoading(false);
          return;
        }

        try {
          const userData = await loginUser(username, password);
          
          if (userData && userData.token) {
            localStorage.setItem("token", userData.token);
              navigate("/dashboard");
          } else {
              setError("Login failed. Please check your credentials.");
          }
      } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || "Login failed. Please try again.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="auth-container">
        <div className="bubble-container"></div>
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
        <h2>Join Study Creator</h2>
        <p>Create and analyze your studies easily.</p>
        <p>Whether you're working on research, surveys or learning materials</p>
        <p>we've got you covered.</p>
        <p>Get started and make the most of your study today!</p>
      </div>
     
      <div className="right-container">
        <div className="auth-card">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <input 
                type="text" 
                name="username" 
                placeholder="Username"
                required 
                data-testid="login-username"
                onChange={(e) => setusername(e.target.value)}
                />
            </div>

            <div className="input-group">
            <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                data-testid="login-password"
                required
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button
              type="submit" 
                className="auth-button"
                data-testid="login-submit"
                disabled={loading}
            >
              {loading ? "Login..." : "Login"}
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