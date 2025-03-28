import express from 'express';
import multer from 'multer';
import upload from '../Middleware/fileUploads.js';
import { studyController } from '../Controllers/studyController.js';
const studyRouter = express.Router();

//----------------POST(CREATE)----------------------------
// Create new study
studyRouter.post('/', studyController.createStudy);

// Upload artifacts
studyRouter.post('/:studyId/questions/:questionId/artifacts', studyController.uploadArtifact);

// Create a question
studyRouter.post('/:studyId/questions', studyController.createQuestion);

//----------------GET-------------------------------------
// Get study for preview, for editing
studyRouter.get('/:studyId', studyController.getStudyById);

// Get artifacts for pagination, sorting
studyRouter.get('/artifacts', studyController.getArtifacts);

//----------------PATCH(UPDATE)-----------------------
// Update a study (title, answer options etc)
studyRouter.patch('/:studyId', studyController.patchStudyById);

// Update question
studyRouter.patch('/:studyId/questions/:questionId', studyController.patchQuestionById);

//----------------DELETE----------------------------------
// Delete/remove artifact from question
studyRouter.delete('/:studyId/questions/:questionId/artifacts/:artifactsId', studyController.deleteArtifactFromQuestion);

// Delete artifact from the collection
studyRouter.delete('/artifacts/:artifactId', studyController.deleteArtifactFromCollection);

// Delete question from study 
studyRouter.delete('/:studyId/questions/:questionId', studyController.deleteQuestionById);



export default studyRouter;