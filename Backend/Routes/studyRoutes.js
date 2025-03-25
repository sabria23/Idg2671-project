import express from 'express';
import { studyController } from '../Controllers/studyController.js';
const studyRouter = express.Router();

// Use validate controllers on all the routes
    // validateCreateStudies
    // validateCreateQuestions
    // validateUploadArtifacts

    // validateGetStudyById
    // validateGetArtifacts
    // validateGetStudyPreview 

    // validatePatchStudyById
    // validatePatchQuestionById

    // validateDeleteArtifactById
    


//----------------POST(CREATE)----------------------------
// Create new study
studyRouter.post('/studies', );

// Upload artifacts
studyRouter.post('/studies/:studyId/questions/:questionId/artifacts');

// Create a question
studyRouter.post('/studies/:studyId/questions');

//----------------GET-------------------------------------
// Get study for preview, for editing
studyRouter.get('/studies/:studyId');

// Get artifacts for pagination, sorting
studyRouter.get('/artifacts');

// Special formatting for preview page of the study
studyRouter.get('/studies/:studyId/preview');


//----------------PATCH(UPDATE)-----------------------
// Update a study (title, answer options etc)
studyRouter.patch('/studies/:studyId');

// Update question
studyRouter.patch('/studies/:studyId/question/:questionId');

//----------------DELETE----------------------------------
// Delete/remove artifact from question
studyRouter.delete('/studies/:studyId/questions/:questionId/artifacts/:artifactsId');

// Delete artifact from the collection
studyRouter.delete('/artifacts/:artifactId');

// Delete question from study 
studyRouter.delete('/studies/:studyId/questions/:questionId');