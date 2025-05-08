import upload from '../Middleware/fileUploads.js';
import express from 'express';
import { artifactController } from '../Controllers/artifactController.js';
import protect from "../Middleware/authMiddleware.js";
import multer from 'multer';

const artifactRouter = express.Router();

// Upload general artifacts
artifactRouter.post('/', upload.array('files'), artifactController.uploadGeneralArtifacts);


// Upload artifacts
artifactRouter.post('/:studyId/questions/:questionId/artifacts', protect, upload.array('files'), artifactController.uploadArtifact);

// Get artifacts for pagination, sorting
artifactRouter.get('/', protect, artifactController.getArtifacts);

// Get artifacts for viewing 
artifactRouter.get('/:id/view', artifactController.getArtifactView);

artifactRouter.get('/user/artifacts', protect, artifactController.getUserArtifacts);

// Delete/remove artifact from question
artifactRouter.delete('/:studyId/questions/:questionId/artifacts/:artifactsId', artifactController.deleteArtifactFromQuestion);

// Delete artifact from the collection
artifactRouter.delete('/artifacts/:artifactId', protect, artifactController.deleteArtifactFromCollection);


export default artifactRouter;