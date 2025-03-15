import express from "express";
import {dashController} from "../Controllers/dashController.js";
const dashRouter = express.Router();

// Get all studies for the dashboard
dashRouter.get('/', dashController.getAllStudies);

// Delete a study from the dashboard
dashRouter.delete('/:studyId', dashController.deleteStudy);

// Get responses for a study (for export page)
dashRouter.get('/:studyId/responses', dashController.getResponses);

// Export study data as JSON
dashRouter.get('/:studyId/responses/export-json', dashController.exportJson);

// Generate a unique shareable link for a study
dashRouter.post('/:studyId/generate-link', dashController.generateLink);

// Add participants via email
dashRouter.post('/:studyId/participants', dashController.addParticipants);

export default dashRouter;












  

