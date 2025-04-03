import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Auth.css";

const SignupPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <form >
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
            />
          </div>
          
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
          
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
            />
            {/*!passwordsMatch && (
              <p className="error-message">Passwords do not match</p>
            )*/}
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
              />
              I agree to the Terms and Privacy Policy
            </label>
          </div>
          
          <button type="submit" className="auth-button">
            Sign Up
          </button>
          
          <div className="auth-redirect">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;