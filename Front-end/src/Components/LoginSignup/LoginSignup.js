import React from "react"; 
import "./loginSignup.css";

const LoginSignup = () =>{
    return (
        <div className="login-container">
               <form action="">
                <h1>Login</h1>
                <div className="inputBox">
                    <input type="text" placeholder="Username" required/>
                </div>
                <div className="inputBox">
                    <input type="password" placeholder="Password" required/>
                </div>

                <div>
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>
                <button type="submit">Login</button>

                <div className="register">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
         
    )
};

export default LoginSignup;