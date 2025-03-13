import express from "express";
import {dashController} from "../Controllers/dashController.js";
const router = express.Router();

// GET /dash-studies - Display studies on the dashboard.  
router.get('/', dashController.getAllStudies);


// GET /dash-studies/:studyId + PUT /studies/:studyId - Edit a study (using the create study page).  
router.put('/:studyId', dashController.updateStudy);


// DELETE /dash-studies/:studyId - Delete a study.
router.delete('/:studyId', dashController.deleteStudy);

export default router;













// GET /dash-studies/:studyId/export - Export data (accessed from the export data page).
// NEED TO FIGURE MORE OUT ON THIS ONE?
/*router.get('/:studyId/export', (req, res) => {
    res.status(200).json({message: 'Export the study'});
})*/
/*   Separate "Initiate Export" and "Download" Endpoints: You could use a POST request to /:studyId/export/initiate to start the export process and then provide a GET request to /:studyId/export/download to download the generated data once it's ready.*/


  

