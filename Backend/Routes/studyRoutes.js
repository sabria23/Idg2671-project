import express from 'express';
import upload from '../Middleware/fileUploads.js';
import { studyController } from '../Controllers/studyController.js';
import {dashController} from "../Controllers/dashController.js";
import protect from "../Middleware/authMiddleware.js";
import { validateStudyId, validatePublishStatus } from "../Validators/dashValidators.js";
import multer from 'multer';



const studyRouter = express.Router();

//----------------POST(CREATE)----------------------------
// Create new study
studyRouter.post('/', protect, studyController.createStudy);

// Upload general artifacts
studyRouter.post('/', (req, res, next) => {
  console.log('✅ HIT /api/artifacts');
  next();
}, upload.array('files'), studyController.uploadGeneralArtifacts);


// Upload artifacts
studyRouter.post('/:studyId/questions/:questionId/artifacts', protect, upload.array('file'), studyController.uploadArtifact);

// Create a question
studyRouter.post('/:studyId/questions', studyController.createQuestion);

//----------------GET-------------------------------------
// Get study for preview, for editing
studyRouter.get('/:studyId', protect, studyController.getStudyById);

// Get artifacts for pagination, sorting
studyRouter.get('/artifacts', protect, studyController.getArtifacts);

//----------------PATCH(UPDATE)-----------------------
// Update a study (title, answer options etc)
studyRouter.patch('/:studyId', protect, studyController.patchStudyById);

// Update question
studyRouter.patch('/:studyId/questions/:questionId', protect, studyController.patchQuestionById);

//----------------DELETE----------------------------------
// Delete/remove artifact from question
studyRouter.delete('/:studyId/questions/:questionId/artifacts/:artifactsId', studyController.deleteArtifactFromQuestion);

// Delete artifact from the collection
studyRouter.delete('/artifacts/:artifactId', protect, studyController.deleteArtifactFromCollection);

// Delete question from study 
studyRouter.delete('/:studyId/questions/:questionId', studyController.deleteQuestionById);

// routers for DASHBOARD, found out that when i rmeoved the protect from my route then i suddlenly coud not dleete studies anymore, so i need to have authenticaiton
studyRouter.get('/', protect,  dashController.getAllStudies);
studyRouter.delete('/:studyId', protect, dashController.deleteStudy);
studyRouter.get('/:studyId/sessions/:sessionid/results', protect, dashController.getResponses);
studyRouter.patch('/:studyId', protect, validatePublishStatus, dashController.updateStudyStatus);
studyRouter.get('/:studyId/link', protect, dashController.generateLink);
studyRouter.post('/:studyId/invitations', protect, dashController.emailInvitaitons);



export default studyRouter;
