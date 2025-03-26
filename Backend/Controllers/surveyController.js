import Study from "../Models/studyModel.js"

export const getSurvey = async (req, res, next) => {
    try {
       const study = await Study.findById(req.params.studyId);
       if (!study) {
        const error = new Error('Study not found');
        error.statusCode = 404;
        throw error;
       } 
    } catch (err) {
        next(err)
    }
};

