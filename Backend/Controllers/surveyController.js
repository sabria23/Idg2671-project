import Study from "../Models/studyModel.js"
import Session from "../Models/participantModel.js";

export const getSurvey = async (req, res, next) => {
    try {
        const {studyId} = req.params;
        const page = parseInt(req.query.page) || 0;

       const study = await Study.findById(studyId);
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

       const totalQuestions = study.questions.length;

       if (page < 0 || page >= totalQuestions) {
        const error = new Error('Invalid page number');
        error.statusCode = 404;
        throw error;
       }

       const question = study.questions[page]

       const previousResponse = participant.responses.find(
        r => r.questionId.toString() === question._id.toString()
      );

       // Send the survey data INCOMPLETE
       res.status(200).json({
        studyTitle: study.title,
        studyDescription: study.description,
        question: {
            id: question._id,
            title: question.questionText,
            type: question.questionType,
            descirption: study.description,
            questions: study.questions
        },
        currentIndex: page,
        totalQuestions,
        previousAnswer: previousResponse?.participantAnswer || null,
        skipped: previousResponse?.skipped || false
       });
    } catch (err) {
        next(err)
    }
};

// Creates the Session for the participant
export const createSession = async (req, res, next) => {
    try {
        const {studyId} = req.params;

        const study = await Study.findById(studyId);
        if (!study || !study.published) {
            const error = new Error('Study not found or not available');
            error.statusCode = 404;
            return next(error);
        }

        // Check if there is an existing session
        let session = await Session.findOne({
            studyId,
            deviceInfo,
            demographics: demographics || {},
            isCompleted: false,
            responses: []
        });

        // If there is a session resume
        if (session) {
            return res.status(200).json({
                message: 'Resumed session',
                session
            });
        }

        // If not then make new one
        session = new Session({
            studyId,
            deviceInfo,
            demographics: demographics || {},
            isCompleted: false,
            responses: []
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
        const {answer, skipped, answerType} = req.body;

        const session = await Session.findById(sessionId);
        if (!session) {
            const error = new Error('Session not found');
            error.statusCode = 404;
            throw error;
        }

        session.responses.push({
            questionId,
            participantAnswer: skipped ? null : answer,
            answerType: answerType,
            skipped: !!skipped
        });

        await participant.save();

        res.status(201).json({
            message: 'Answer submitted',
            participant
        });
    } catch (err) {
        next(err);
    }
};


export const updateAnswer = async (req, res, next) => {
    try {
        const {studyId, participantId, questionId} = req.params;
        const {answer, skipped} = req.body;

        const participant = await Participant.findOne({study: studyId, participantId});
        if (!participant) {
            const error = new Error('participant not found');
            error.statusCode = 404;
            throw error;
        }

        const response = participant.responses.find(
            r => r.questionId.toString() === questionId
          );

        
        response.participantAnswer = skipped ? null : answer,
        response.skipped = !!skipped

        await participant.save();

        res.status(201).json({
            message: 'Answer updated',
            responses: participant.responses
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