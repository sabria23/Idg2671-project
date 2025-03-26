import express from "express";
//import {} from ''; // Controllers
//import {} from ''; // Validation

const surveyRouter = express.Router();

// Displaying survey
surveyRouter.get('/api/studies/:studyId/survey');

// Create a new session
surveyRouter.post('/api/studies/:studyid/sessions');

// Store responses
surveyRouter.post('/api/studies/:studyid/sessions/:sessionId/:questionId');

// Change answer
surveyRouter.patch('/api/studies/:studyid/sessions/:sessionId/:questionId');

// patch to update to complete? This can maybe be used for denying further accsess based on that the user has already completed
// surveyRouter.patch('/api/studies/studyid/sessions/sessionId')?