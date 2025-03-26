// i define routes in routes folder and the functionlaity with callbacks fucntions declaring status and messages go here
import { v4 as uuidv4 } from "uuid";
//import Study from '../Models/studyModel.js';

// @desc Get all studies
// @route GET /api/studies
// @access Private (after auth is added)
const getAllStudies = async (req, res) => {
   
};

// @desc Delete a study
// @route DELETE /api/studies/:studyId
// @access Private (after auth is added)
// IMPORTANT THE REQ.PARAMS.STUDYID i think i need to use this oen for the postman
const deleteStudy = async (req, res) => {

};

// @desc Get responses for a study (for export page)
// @route GET /api/studies/:studyId/responses
// @access Private (after auth is added)
// Consider adding pagination if you expect a large number of responses
const getResponses = (req, res) => {
    res.status(200).json({ message: `Get responses for study ${req.params.studyId}` });
};


// @desc update status of the study (publish/unpubloshed)
// @route PATCH /api/studies/:studyId/public
// @access Private (after auth is added)
const updateStudyStatus = (req, res) => {
    res.status(200).json({ message: ` You have published study ${req.params.studyId}, get your URl Link` });
}

// @desc generate a URL link to publish that quiz
// @route POST /api/studies/:studyId/generate-link
// @access Private (after auth is added)
const generateLink = (req, res) => {
    res.status(200).json({ message: `Generate link for study ${req.params.studyId}` });
};



// @desc Add participants via email
// @route POST /api/studies/:studyId/participants
// @access Private (after auth is added)
const emailInvitaitons = (req, res) => {
    res.status(200).json({ message: `Add participants to study ${req.params.studyId}` });
};





export const dashController = {
    getAllStudies,
    deleteStudy,
    getResponses,
    generateLink,
    emailInvitaitons,
    updateStudyStatus
};

