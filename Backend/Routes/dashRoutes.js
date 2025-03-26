import express from "express";
import {dashController} from "../Controllers/dashController.js";
const dashRouter = express.Router();


dashRouter.get('/', dashController.getAllStudies);
dashRouter.delete('/:studyId', dashController.deleteStudy);
dashRouter.get('/:studyId/sessions/responses', dashController.getResponses);
dashRouter.patch('/:studyId/public', dashController.updateStudyStatus);
dashRouter.post('/:studyId/public-url', dashController.generateLink);
dashRouter.post('/:studyId/invitations', dashController.emailInvitaitons);

export default dashRouter;












  

