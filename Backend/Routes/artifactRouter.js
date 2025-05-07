import upload from '../Middleware/fileUploads.js';
import express from 'express';
import { studyController } from '../Controllers/studyController.js';
import protect from "../Middleware/authMiddleware.js";
import multer from 'multer';

const artifactRouter = express.Router();

// Upload general artifacts
artifactRouter.post('/', upload.array('files'), studyController.uploadGeneralArtifacts);


// Upload artifacts
artifactRouter.post('/:studyId/questions/:questionId/artifacts', protect, upload.array('files'), studyController.uploadArtifact);

// Get artifacts for pagination, sorting
artifactRouter.get('/', protect, studyController.getArtifacts);

// Delete/remove artifact from question
artifactRouter.delete('/:studyId/questions/:questionId/artifacts/:artifactsId', studyController.deleteArtifactFromQuestion);

// Delete artifact from the collection
artifactRouter.delete('/artifacts/:artifactId', protect, studyController.deleteArtifactFromCollection);


export default artifactRouter;