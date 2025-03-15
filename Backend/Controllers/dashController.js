// i define routes in routes folder and the functionlaity with callbacks fucntions declaring status and messages go here
import { v4 as uuidv4 } from "uuid";

// @desc Get all studies
// @route GET /api/dash-studies
// @access Private (after auth is added)
const getAllStudies = async (req, res) => {
    try {
        const studies = await Study.find({}); // Fetch all studies
        res.status(200).json(studies);
    } catch (error) {
        console.error("Error fetching studies:", error);
        res.status(500).json({ message: "Failed to fetch studies" });
    }
};

// @desc Delete a study
// @route DELETE /api/dash-studies/:studyId
// @access Private (after auth is added)
// IMPORTANT THE REQ.PARAMS.STUDYID i think i need to use this oen for the postman
const deleteStudy = async (req, res) => {
    try {
        const studyId = req.params.studyId;
        const deletedStudy = await Study.findByIdAndDelete(studyId);

        if (!deletedStudy) {
            return res.status(404).json({ message: "Study not found" });
        }

        res.status(200).json({ message: `Study ${studyId} deleted successfully` });
    } catch (error) {
        console.error("Error deleting study:", error);
        res.status(500).json({ message: "Failed to delete study" });
    }
};

// @desc Get responses for a study (for export page)
// @route GET /api/dash-studies/:studyId/responses
// @access Private (after auth is added)
const getResponses = (req, res) => {
    res.status(200).json({ message: `Get responses for study ${req.params.studyId}` });
};

// @desc Export study data as JSON
// @route GET /api/dash-studies/:studyId/responses/export-json
// @access Private (after auth is added)
const exportJson = (req, res) => {
    res.status(200).json({ message: `Export study ${req.params.studyId} as JSON` });
};

// @desc Generate a unique shareable link for a study
// @route POST /api/dash-studies/:studyId/generate-link
// @access Private (after auth is added)
const generateLink = (req, res) => {
     res.status(200).json({ message: `Generate link for study ${req.params.studyId}` });
};

// @desc Add participants via email
// @route POST /api/dash-studies/:studyId/participants
// @access Private (after auth is added)
const addParticipants = (req, res) => {
    res.status(200).json({ message: `Add participants to study ${req.params.studyId}` });
};


export const dashController = {
    getAllStudies,
    deleteStudy,
    getResponses,
    exportJson,
    generateLink,
    addParticipants
};

