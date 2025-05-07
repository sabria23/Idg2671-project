import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";

const protect = asyncHandler(async (req, res, next) => { 
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1]
            console.log("extracted token:", token);
            
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log("extracted decoded token:", decoded);
            //  GET user from the token
            req.user = await User.findById(decoded.id).select("-password")
            console.log("user found:", req.user);
            return next();
        } catch (error) {
            console.log("JWT verfication",error);
            res.status(401)
            throw new Error("Not authorized");
        }
    }

    if(!token) {
        res.status(401)
        throw new Error("not authorized")
    }
});



export default protect;