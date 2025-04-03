import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Auth.css";

const LoginPage = () => {


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form >
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
              /> Remember me
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
  );
};

export default LoginPage;