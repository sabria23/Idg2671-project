// to test if you see the message ('register user') in the postman after selecting GET and adding http://localhost:8000/api/users
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; //to hass passwords
import User from "../Models/userModel.js";

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
    //when sending request to register a user you are sending request from the body data via POST
    const {username, name, email, password} = req.body;

    if(!username || !name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // check if user exists
    const userExists = await User.findOne({email});
    
    if (userExists) {
        res.status(400)
        throw new Error('User already exists, please login')
    }

    // hashing the password
    // 10 is default
    const salt = await bcrypt.genSalt(10);
    // takes in password that comes from a form and next arguemnt/parameters is the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        username,
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
};


// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
    res.json({message: 'login User'});
};


// @desc Get user data
// @route GET /api/users/me  ---> get the current logged in user
// @access Public
const getMe = async (req, res) => {
    res.json({message: 'User data display'});
};


export {registerUser, loginUser, getMe};