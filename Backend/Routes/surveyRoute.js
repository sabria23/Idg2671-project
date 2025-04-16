import express from "express";
import { getSurvey, createSession, submitAnswer, updateAnswer, completeSession } from "../Controllers/surveyController.js"; // Controllers
//import {  validateSessionId } from "../Validators/surveyValidators.js";

const surveyRouter = express.Router();

// Get study details for participants
surveyRouter.get('/:studyId',  getSurvey);

// Sessions resource
// Create a new session
surveyRouter.post('/:studyId/sessions', createSession);

// Complete a session
surveyRouter.patch('/:studyId/sessions/:sessionId/complete', 
    completeSession);

// Responses resource
// Submit an answer
surveyRouter.post('/:studyId/sessions/:sessionId/responses', 
    submitAnswer);

// Update an answer
surveyRouter.patch('/:studyId/sessions/:sessionId/responses/:responseId', 
    updateAnswer);

// patch to update to complete? This can maybe be used for denying further accsess based on that the user has already completed
// surveyRouter.patch('/api/studies/studyid/sessions/sessionId')?

export default surveyRouter;