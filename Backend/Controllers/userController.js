// to test if you see the message ('register user') in the postman after selecting GET and adding http://localhost:8000/api/users

// @desc Register new User
// @route POST /api/users
// @access Public
const registerUser = (req, res) => {
    res.json({message: 'register User'});
};


// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = (req, res) => {
    res.json({message: 'login User'});
};


// @desc Get user data
// @route GET /api/users/me  ---> get the current logged in user
// @access Public
const getMe = (req, res) => {
    res.json({message: 'User data display'});
};


export {registerUser, loginUser, getMe};