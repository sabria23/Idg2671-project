import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";
// @route POST /api/auth/register
// @desc create new user 
const createUser = async (req, res, next) => {
    try {
        const { username, email, password} = req.body 
    if(!username || !email || !password) {
            return res.status(400).json({message: "Please add all fields" })
    }
 // check if user exists
    const userExits = await User.findOne({email});

    if(userExits) {
        return res.status(400).json({message: "Username already exists" })
    }

    // hash passowrd
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("hashed password", hashedPassword);
        
        // create user
        const user = await User.create({
            username, 
            email,
            password: hashedPassword,
        })

        if(user) {
            res.status(200).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            return res.status(400).json({message: "invalid user data" })
        }
    } catch (error) {
        next(error);
    }
    
};

// @route post /api/auth/login
// @desc authenticates user creddentials after registers 
const authenticateLogin = async (req, res, next) => {
    console.log(req.body);

    try {
        const {username, password} = req.body 
        console.log(req.body);
        
        // checking user email
        const user = await User.findOne({username})

        if(user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                token: generateToken(user._id)
            })
        } else {
            return res.status(400).json({message: "invalid credentials" })
        }
    } catch (error) {
        next(error);
    }
    
};

// @route post /api/auth/logout 
// @desc clear the authentication taken
const authenticateLogout = async (req, res, next) => {
    try {
        const {username, password} = req.body 

        // checking user email
        const user = await User.findOne({username})

        if(user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
            })
        } else {
            return res.status(400).json({message: "invalid credentials" })
        }
    } catch (error) {
        next(error);
    }
};

// @route GET /api/auth/user 
// @desc return current user data 
// @access
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }
        res.status(200).json({
            data: { 
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
       next(error) ;
    }
};

// @route POST /api/auth/forgot-password
// @desc password reset (optional) 


// @route post /api/auth/reset-passwrod
// @desc  (optional)

// generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}

export const userController = {
    createUser,
    authenticateLogin,
    authenticateLogout,
    getUser
};