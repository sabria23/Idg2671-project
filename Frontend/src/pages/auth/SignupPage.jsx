import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import axios from "axios";

// Sources: (https://www.youtube.com/watch?v=ZVyIIyZJutM&ab_channel=CodeWithYousaf)
// Used for "useState" and "link"
const SignupPage = () => {
  const [userName, setuserName] = useState(" ")
  const [email, setEmail] = useState(" ")
  const [password, setPassword] = useState(" ")
  const [confirmPassword, setconfirmPassword] = useState(" ")
  const [errorMessage, setErrorMessage] = useState("");

  // if (password !== confirmPass) {
  //   alert("Password do not match");
  //   return;
  // }
const navigate = useNavigate();

  const handleSubmit = (e) =>{
    e.preventDefault()

    if(password !== confirmPassword) {
      setErrorMessage("Password do not match");
      return;
    }


    axios.post("http://localhost:8000/api/auth/register", {username: userName, email, password})
    .then(result => {
      console.log(result);

      if(result.data && result.data.token) {
        localStorage.setItem("token", result.data.token);
        navigate("/login")
      } else {
        setErrorMessage("An error occrued. Please try again later")
      }
    })
    .catch(err => {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.errorMessage || "An error occrued.")
      } else {
        setErrorMessage("Unable to register. Please try again later")
      }
      console.log("Error durig registration:", err);
    });
  };
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
        <form onSubmit={handleSubmit}>
          <div className="input-group">
          <label htmlFor="fullname">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              data-testid="register-username"
              onChange={(e) => setuserName(e.target.value)}
              required
              />
              {errorMessage && errorMessage.includes("Username") && (
                <p>{errorMessage}</p>
              )}
            
          </div>
          
          <div className="input-group">
          <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              data-testid="register-email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
          <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              data-testid="register-password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              data-testid="register-confirmPassword"
              onChange={(e) => setconfirmPassword(e.target.value)}
              required
            />
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

          <p className="error-message">{errorMessage}</p>
          
          <button 
          type="submit" 
          className="auth-button"
          data-testid="register-submit"
          >
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