import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";
import axios from "axios";

// Sources: (https://www.youtube.com/watch?v=ZVyIIyZJutM&ab_channel=CodeWithYousaf)
// Used for "useState" and "link"
const SignupPage = () => {
  const [userName, setuserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setconfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // if (password !== confirmPass) {
  //   alert("Password do not match");
  //   return;
  // }
const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage(""); // reset success
    setIsLoading(true);

    if(password !== confirmPassword) {
      setErrorMessage("Password do not match");
      setIsLoading(false); //stop loading
      return;
    }

    if (!isAgreeTerms) {
      setErrorMessage("You must agree to the Terms and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/auth/register", {
        username: userName,
        email,
        password,
        confirmPassword
      });

    if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setSuccessMessage("Registration successful! Redirecting to login...")
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMessage("Something went wrong. Please try again later")
      }
    } catch (err) {
     
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const messages = err.response.data.errors || [{ msg: "Something went wrong" }];
        setErrorMessage(messages.map((e) => e.msg).join(" "));
      } else {
        setErrorMessage("Unable to register. Please try again later")
      }
      console.log("Error durig registration:", err);
    } finally {
      setIsLoading(false);
    }
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
        <h2>Join Study Creator</h2>
        <p>Create and analyze your studies easily.</p>
        <p>Whether you're working on research, surveys or learning materials</p>
        <p>we've got you covered.</p>
        <p>Get started and make the most of your study today!</p>
      </div>
      <div className="right-container">
        <div className="auth-card">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
          <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              data-testid="register-username"
              onChange={(e) => setuserName(e.target.value)}
              required
              className={errorMessage && errorMessage.includes("Username") ? "error-input" : ""}
              />
              
            
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
              className={errorMessage && errorMessage.includes("email") ? "error-input" : ""}
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
              className={errorMessage && errorMessage.includes("Password") ? "error-input" : ""}
            />
            {errorMessage && errorMessage.includes("password") && (
                <p className="error-message">{errorMessage}</p>
              )}
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
              className={errorMessage && errorMessage.includes("confirmPassword") ? "error-input" : ""}
            />
            {/* {errorMessage && errorMessage.includes("confirmPassword") && (
                <p className="error-message">{errorMessage}</p>
              )} */}
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={isAgreeTerms}
                onChange={(e) => setIsAgreeTerms(e.target.checked)}
              />
              I agree to the Terms and Privacy Policy
            </label>
            <p className="error-message">{errorMessage}</p>
          </div>

          {/* <p className="error-message">{errorMessage}</p> */}
            <p className="success-message">{successMessage}</p>


          {isLoading && <p className="loading-message">Please wait...</p>}
          
          <button 
          type="submit" 
          className="auth-button"
          data-testid="register-submit"
          disabled={isLoading}
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