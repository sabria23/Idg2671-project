import express from "express";
import {dashController} from "../Controllers/dashController.js";
const dashRouter = express.Router();

// Get all studies for the dashboard
// /api/studies
dashRouter.get('/', dashController.getAllStudies);

// Delete a study from the dashboard
// api/studies/sutudyId
dashRouter.delete('/:studyId', dashController.deleteStudy);

// Get responses for a study (for export page)
dashRouter.get('/:studyId/sessions/responses', dashController.getResponses);

// update status of the study (publish/unpubloshed)
dashRouter.patch('/:studyId/public', dashController.updateStudyStatus);

//generate a URL link to publish that quiz
dashRouter.post('/:studyId/public-url', dashController.generateLink);

// Add participants via email
// iM NOT HAPPY ABOUT THIS ENDPOINT
dashRouter.post('/:studyId/participants', dashController.addParticipants);

export default dashRouter;












  

