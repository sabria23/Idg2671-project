import express from "express";
import { getSurvey, createSession, submitAnswer, updateAnswer } from "../Controllers/surveyController.js"; // Controllers
//import {} from ''; // Validation

const surveyRouter = express.Router();

// Displaying survey
surveyRouter.get('/:studyId/survey', getSurvey);

// Create a new session
surveyRouter.post('/:studyId/sessions', createSession);

// Store responses
surveyRouter.post('/:studyId/sessions/:sessionId/:questionId', submitAnswer);

// Change answer
surveyRouter.patch('/:studyId/sessions/:sessionId/:questionId', updateAnswer);

// patch to update to complete? This can maybe be used for denying further accsess based on that the user has already completed
// surveyRouter.patch('/api/studies/studyid/sessions/sessionId')?

export default surveyRouter;