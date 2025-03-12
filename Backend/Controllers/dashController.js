// i define routes in routes folder and the functionlaity with callbacks fucntions declaring status and messages go here

// @desc Get all studies 
// @route GET /api/dash-studies
// @access Private (after auth is added)
const getAllStudies = (req, res) => {
    res.status(200).json({message: 'Get studies on dashborad'});
};

// @desc Update a study
// @route PUT /api/dash-studies/:studyId
// @access Private (after auth is added)
// :params so :studyId is a param whcih is being requested
const updateStudy = (req, res) => {
    res.status(200).json({message: `Update a study ${req.params.studyId}`});
};

// @desc Delete a study
// @route DELETE /api/dash-studies/:studyId
// @access Private (after auth is added)
const deleteStudy = (req, res) => {
    res.status(200).json({message: `Update a study ${req.params.studyId}`});
};

export const dashController = {
    getAllStudies,
    updateStudy,
    deleteStudy
};






// @desc  Export a study
// @route GET /api/dash-studies
// @access Private (after auth is added)
/*export const exportStudy = (req, res) => {
    res.status(200).json({message: 'Get studies on dashborad'});
};*/