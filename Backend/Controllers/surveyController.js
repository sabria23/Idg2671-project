import Study from "../Models/studyModel.js";
import Session from "../Models/participantModel.js";

//@desc retrieve and return study's data fro paritipants
// @route GET /api/studies/...
export const getSurvey = async (req, res, next) => {
    try {
       const study = await Study.findById(req.params.studyId);
       if (!study) {
        const error = new Error('Study not found');
        error.statusCode = 404;
        throw error;
       }

       // Only return published studies to participants
       if (!study.published) {
        const error = new Error('This study is not available');
        error.statusCode = 403;
        return next(error);
    }

       // returning only the data needed for the survey
       res.status(200).json({
        id: study._id,
        title: study.title,
        descirption: study.description,
        questions: study.questions
       });
    } catch (err) {
        next(err)
    }
};

// @desc create a new session for participants to track anonym participants
export const createSession = async (req, res, next) => {
    try {
        //const {participantId} = req.body;
        const {studyId} = req.params;

        // Optional: get demographics data if provided
        // const { demographics } = req.body;

        // Check if study exists and is published
        const study = await Study.findById(studyId);
        if (!study || !study.published) {
            const error = new Error('Study not found or not available');
            error.statusCode = 404;
            return next(error);
        }

          // Create new session
          const session = new Session({
            studyId,
            deviceInfo,
            demographics: demographics || {},
            isCompleted: false,
            responses: []
        });

        await session.save();

        res.status(201).json({
            message: 'Session created successfully',
            sessionId: session._id
        });
    } catch (err) {
        next(err);
    }
};

// Save a participant wuestion
export const submitAnswer = async (req, res, next) => {
    try {
        const {sessionId, questionId} = req.params;
        const {answer, skipped} = req.body;

        const session = await Session.findById(sessionId);
        if (!session) {
            const error = new Error('Session not found');
            error.statusCode = 404;
            throw error;
        }

        session.responses.push({
            questionId,
            participantAnswer: skipped ? null : answer,
            skipped: !!skipped
        });

        await session.save();

        res.status(201).json({
            message: 'Answer submitted',
            session
        });
    } catch (err) {
        next(err);
    }
};


export const updateAnswer = async (req, res, next) => {
    try {
        const {sessionId, questionId} = req.params;
        const {answer, skipped} = req.body;

        const session = await Session.findById(sessionId);
        if (!session) {
            const error = new Error('Session not found');
            error.statusCode = 404;
            throw error;
        }

        const response = session.responses.find(
            r => r.questionId.toString() === questionId
          );

        
        response.participantAnswer = skipped ? null : answer,
        response.skipped = !!skipped

        await session.save();

        res.status(201).json({
            message: 'Answer updated',
            session
        });        
    } catch (err) {
        next(err);
    }
};


//export const completeSession = async (req, res, next) => {
//    try {
//        
//    } catch (err) {
//        next(err);
//    }
//};