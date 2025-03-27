import express from "express";
import {dashController} from "../Controllers/dashController.js";
import protect from "../Middleware/authMiddleware.js";
import { validateStudyId, validatePublishStatus } from "../Validators/dashValidators.js";
const dashRouter = express.Router();


dashRouter.get('/', protect,  dashController.getAllStudies);
dashRouter.delete('/:studyId', protect, dashController.deleteStudy);
dashRouter.get('/:studyId/sessions/responses', protect, dashController.getResponses);
dashRouter.patch('/:studyId/public', protect, validatePublishStatus, dashController.updateStudyStatus);
dashRouter.post('/:studyId/public-url', protect, dashController.generateLink);
dashRouter.post('/:studyId/invitations', protect, dashController.emailInvitaitons);

export default dashRouter;












  

