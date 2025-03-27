import { body, param, validationResult } from 'express-validator';
 //reused from oblig 2 - modesta
// Helper middleware to check validation results
export const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

// Validator for studyId parameter
export const validateStudyId = [
    param('studyId')
      .isMongoId()
      .withMessage('Invalid study ID format'),
    checkValidation
  ];
  
  // Validator for publish/unpublish endpoint
  export const validatePublishStatus = [
    param('studyId')
      .isMongoId()
      .withMessage('Invalid study ID format'),
    body('published')
      .isBoolean()
      .withMessage('Published status must be a boolean value'),
    checkValidation
  ];

  