// import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Auth.css";

const SignupPage = () => {
  return (
    <div className="auth-container">
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
        <h1>Create Account</h1>
        <form >
          <div className="input-group">
          <label for="fullname">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
            />
          </div>
          
          <div className="input-group">
          <label for="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
          
          <div className="input-group">
          <label for="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          
          <div className="input-group">
          <label for="password">Password</label>
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
      
    </div>
  );
};

export default SignupPage;