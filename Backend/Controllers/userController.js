import users from "../Models/userModel.js";
// @route POST /api/auth/register
// @desc create new user 
const createUser = async (req, res, next) => {
    try {
        res.status(201).json({ message: "User registered success"});
    } catch (error) {
       next(error) ;
    }
};

// @route post /api/auth/login
// @desc authenticates user creddentials after registers 
const authenticateLogin = async (req, res, next) => {
    try {
        res.status(201).json({ message: "User registered success"});
    } catch (error) {
       next(error) ;
    }
};

// @route post /api/auth/logout 
// @desc clear the authentication taken
const authenticateLogout = async (req, res, next) => {
    try {
        res.status(201).json({ message: "User registered success"});
    } catch (error) {
       next(error) ;
    }
};

// @route GET /api/auth/user 
// @desc return current user data 
const getUser = async (req, res, next) => {
    try {
        res.status(201).json({ message: "User registered success"});
    } catch (error) {
       next(error) ;
    }
};

// @route POST /api/auth/forgot-password
// @desc password reset (optional) 


// @route post /api/auth/reset-passwrod
// @desc  (optional)

export const userController = {
    createUser,
    authenticateLogin,
    authenticateLogout,
    getUser
};