import { body, param, validationResult } from 'express-validator';
import User from "../Models/userModel.js";

export const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

// Validator for e-post
export const validateEmail = [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    checkValidation
  ];
  
  // Validator for password
  export const validatePassword = [
    body('password')
      .isLength({ min: 5})
      .withMessage('Password must be at least 5 characters long'),
    checkValidation
  ];

  // Validator for username
  export const validateUsername = [
    body('username')
      .isLength({ min: 3})
      .withMessage('Username must be at least 3 characters long')
      .custom(async (username) => {
        const existUser = await User.findOne({ username });
        if (existUser) {
            throw new Error("Username is already taken");
        }
      }),
    checkValidation
  ];

  export const validatePicture = [
    body("avatar")
      .optional()
      .isString()
      .isURL()
      .withMessage("Picture must be a valid URL"),
      checkValidation
  ]

  export const validateUserRegistration = [
    validateEmail,
    validatePassword,
    validateUsername
  ];

