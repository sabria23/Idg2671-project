import Study from "../Models/studyModel.js"

export const getSurvey = async (req, res, next) => {
    try {
       const study = await Study.findById(req.params.studyId);
       if (!study) {
        const error = new Error('Study not found');
        error.statusCode = 404;
        throw error;
       }
       // Send the survey data INCOMPLETE
       res.status(200).json('')
    } catch (err) {
        next(err)
    }
};

// Creates the session for the participant
export const createSession = async (req, res, next) => {
    try {
        const {participantId} = req.body;
        const {studyId} = req.params;

        if (!participantId){
            const error = new Error('ParticipantId is required');
            error.statusCode = 400;
            throw error;
        }

        // Check if there is an existing session
        let session = await session.findOne({
            study: studyId,
            participantId,
            isComplete: false
        });

        // If there is a session resume
        if (session) {
            return res.status(200).json({
                message: 'Resumed session',
                session
            });
        }

        // If not then make new one
        session = new session({
            study: studyId,
            participantId
        });

        await session.save();

        res.status(201).json({
            message: 'New session created',
            session
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