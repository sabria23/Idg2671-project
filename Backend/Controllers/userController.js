import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";
import Study from "../Models/studyModel.js";
import Artifact from "../Models/artifactModel.js";


// @route POST /api/auth/register
// @desc create new user 
const createUser = async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body 

        const userExists = await User.findOne({ username });
        const emailExists = await User.findOne({ email });

        if (userExists || emailExists ) {
          return res.status(400).json({message: "Username or email already exists" })
        }

        if (password !== confirmPassword) {
          return res.status(400).json({
            errors: [{ field: "confirmPassword", msg: "Passwords do not match" }],
          })
        }

    // hash passowrd
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // create user
        const user = await User.create({
            username, 
            email,
            password: hashedPassword,
            avatar: null,
        });

          res.status(200).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id),
          });
    } catch (error) {
        next(error);
    }
    
};


// @route post /api/auth/login
// @desc authenticates user creddentials after registers 
const authenticateLogin = async (req, res, next) => {
    try {
        const {username, password} = req.body 
        
        // checking user email
        const user = await User.findOne({ username })
        if (!user) {
          return res.status(400).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
          return res.status(400).json({ message: "invalid username or password"});
        }

        // if(user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id)
            })
        // } else {
        //     return res.status(400).json({message: "invalid usrname or password" })
        // }
    } catch (error) {
        next(error);
    }
    
};

// @route post /api/auth/logout 
// @desc clear the authentication taken
const authenticateLogout = async (req, res, next) => {
    try {
        // const {username, password} = req.body 
        res.json({ message: "Logged out"});
        // // checking user email
        // const user = await User.findOne({username})

        // if(user && (await bcrypt.compare(password, user.password))) {
           
        // } else {
        //     return res.status(400).json({message: "invalid credentials" })
        // }
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
        if (!user) return res.status(404).json({ message: "User not found" })
          
        res.status(200).json({
            data: { 
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
       next(error) ;
    }
};


const updateUserProfile = async(req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      
      // handling avatar file
    if(req.file) {
        user.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated", data: user });

    // if password is provided, hash and update
      // if (req.body.password) {
      //   const salt = await bcrypt.genSalt(10);
      //   user.password = await bcrypt.hash(req.body.password, salt);
      // }

      // const updatedUser = await user.save();

      // res.json({
      //   _id:updatedUser._id,
      //   username:updatedUser.username,
      //   email:updatedUser.email,
      //   avatar:updatedUser.avatar,
      //   token: generateToken(updatedUser._id),
      // });

  } catch (err) {
    console.error(err);
    
    res.status(500).json({ message: "something went wrong with avatar"});

  }
};


// https://www.youtube.com/watch?v=ZxRnbNDUVGo&ab_channel=CodingCleverly
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  epost 
    user.email = `deleted_${userId}@example.com`;
    await user.save();

    await Promise.all([
      Study.deleteMany({ creator: userId }),
      Artifact.deleteMany({ uploadedBy: userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.status(200).json({ message: "User and all related data (including email) deleted successfully" });
  } catch (error) {
    next(error);
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
    getUser,
    updateUserProfile,
    deleteUser,
};