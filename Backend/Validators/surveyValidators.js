/*import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Helper middleware to check validation results
export const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
};


// Validate sessionId parameter
export const validateSessionId = [
    param('sessionId')
      .isMongoId()
      .withMessage('Invalid session ID format'),
    checkValidation
];


// Validate responseId parameter
export const validateResponseId = [
    param('responseId')
      .isMongoId()
      .withMessage('Invalid response ID format'),
    checkValidation
];

// Validate answer submission
export const validateAnswerSubmission = [
    body('answer')
      .optional()
      .customSanitizer(value => {
        // Sanitize input to prevent SQL injection
        // This depends on the type of answer you're expecting
        return value;
      }),
    body('answerType')
      .isIn(['text', 'ranking', 'numeric', 'selection'])
      .withMessage('Invalid answer type'),
    body('skipped')
      .isBoolean()
      .withMessage('Skipped must be a boolean value'),
    checkValidation
];

// Validate demographics
export const validateDemographics = [
    body('demographics.age')
      .optional()
      //.isIn(['under 18', '18-25', '25-35', '35-45', '45-55', '55-65', '65+'])
      .withMessage('Invalid age range'),
    body('demographics.gender')
      .optional()
      //.isIn(['female', 'male', 'prefer_not_to_say'])
      .withMessage('Invalid gender value'),
    checkValidation
];*/