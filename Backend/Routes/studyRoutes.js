import express from 'express';
import { studyController } from '../Controllers/studyController.js';
const studyRouter = express.Router();

//----------------POST(CREATE)----------------------------
// Create new study
studyRouter.post('/studies', studyController.createStudy);

// Upload artifacts
studyRouter.post('/studies/:studyId/questions/:questionId/artifacts', studyController.uploadArtifact);

// Create a question
studyRouter.post('/studies/:studyId/questions', studyController.createQuestion);

//----------------GET-------------------------------------
// Get study for preview, for editing
studyRouter.get('/studies/:studyId', studyController.getStudyById);

// Get artifacts for pagination, sorting
studyRouter.get('/artifacts', studyController.getArtifacts);

//----------------PATCH(UPDATE)-----------------------
// Update a study (title, answer options etc)
studyRouter.patch('/studies/:studyId', studyController.patchStudyById);

// Update question
studyRouter.patch('/studies/:studyId/question/:questionId', studyController.patchQuestionById);

//----------------DELETE----------------------------------
// Delete/remove artifact from question
studyRouter.delete('/studies/:studyId/questions/:questionId/artifacts/:artifactsId', studyController.deleteArtifactFromQuestion);

// Delete artifact from the collection
studyRouter.delete('/artifacts/:artifactId', studyController.deleteArtifactFromCollection);

// Delete question from study 
studyRouter.delete('/studies/:studyId/questions/:questionId', studyController.deleteQuestionById);

export default studyRouter;