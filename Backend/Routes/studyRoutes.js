import express from 'express';
import { studyController } from '../Controllers/studyController.js';
import {dashController} from "../Controllers/dashController.js";
import protect from "../Middleware/authMiddleware.js";
import { validateStudyId, validatePublishStatus } from "../Validators/dashValidators.js";
import multer from 'multer';

const upload = multer();

const studyRouter = express.Router();

//----------------POST(CREATE)----------------------------
// Create new study
studyRouter.post('/', protect, upload.array('files'), studyController.createStudy);

// Create a question
studyRouter.post('/:studyId/questions', studyController.createQuestion);

//----------------GET-------------------------------------
// Get study for preview, for editing
studyRouter.get('/:studyId', protect, studyController.getStudyById);

//----------------PATCH(UPDATE)-----------------------
// Update a study (title, answer options etc)
studyRouter.patch('/:studyId', protect, upload.none(), studyController.patchStudyById);

// Update question
studyRouter.patch('/:studyId/questions/:questionId', protect, studyController.patchQuestionById);

//----------------DELETE----------------------------------
// Delete question from study 
studyRouter.delete('/:studyId/questions/:questionId', studyController.deleteQuestionById);

// dahsboard routes
studyRouter.get('/', protect,  dashController.getAllStudies);
studyRouter.delete('/:studyId', protect, dashController.deleteStudy);
studyRouter.get('/:studyId/sessions/:sessionid/results', protect, dashController.getResponses);
studyRouter.patch('/:studyId', protect, validatePublishStatus, dashController.updateStudyStatus);
studyRouter.get('/:studyId/link', protect, dashController.generateLink);
studyRouter.post('/:studyId/invitations', protect, dashController.emailInvitaitons);
// Demographics configuration routes
studyRouter.get('/:studyId/demographics', protect, studyController.getDemographics);
studyRouter.post('/:studyId/demographics', protect, studyController.updateDemographicsConfig);
// public route for participants
studyRouter.get('/public/:studyId', dashController.accessStudyByLink);



export default studyRouter;
