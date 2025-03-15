// i define routes in routes folder and the functionlaity with callbacks fucntions declaring status and messages go here

// @desc Get all studies
// @route GET /api/dash-studies
// @access Private (after auth is added)
const getAllStudies = (req, res) => {
    res.status(200).json({message: 'Get studies on dashboard'});
};

// @desc Delete a study
// @route DELETE /api/dash-studies/:studyId
// @access Private (after auth is added)
const deleteStudy = (req, res) => {
    res.status(200).json({message: `Delete a study ${req.params.studyId}`});
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

