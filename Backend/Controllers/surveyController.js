<<<<<<< HEAD
import Study from "../Models/studyModel.js"
=======
import Study from "../Models/studyModel.js";
>>>>>>> main
import Session from "../Models/participantModel.js";

//@desc retrieve and return study's data fro paritipants
// @route GET /api/studies//:studyId/survey
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

<<<<<<< HEAD

=======
>>>>>>> main
       // Only return published studies to participants
       if (!study.published) {
        const error = new Error('This study is not available');
        error.statusCode = 403;
        return next(error);
<<<<<<< HEAD
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
=======
    }

       // returning only the data needed for the survey
       res.status(200).json({
        id: study._id,
        title: study.title,
        descirption: study.description,
        questions: study.questions
>>>>>>> main
       });
    } catch (err) {
        next(err)
    }
};

<<<<<<< HEAD
// Creates the Session for the participant
export const createSession = async (req, res, next) => {
    try {
        const {studyId} = req.params;

=======
// @desc create a new session for participants to track anonym participants
// @route POST /api/studies/:studyid/sessions/
export const createSession = async (req, res, next) => {
    try {
        //const {participantId} = req.body;
        const {studyId} = req.params;

        // Optional: get demographics data if provided
        // const { demographics } = req.body;

        // Check if study exists and is published
>>>>>>> main
        const study = await Study.findById(studyId);
        if (!study || !study.published) {
            const error = new Error('Study not found or not available');
            error.statusCode = 404;
            return next(error);
        }

<<<<<<< HEAD
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
=======
          // Create new session
          const session = new Session({
>>>>>>> main
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

// @desc save participant's answer related to quesitons
// @route POST /api/studies/:studyid/sessions/:sessionId/:questionId
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

        // mangler kode som: verifyies that the question exsts in the study 
        // after you chekced that only then you can add the responses (as done below)
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

// @desc Change answer to user, if they what to update their answer
//@route PATCH /api/studies/:studyid/sessions/:sessionId/:questionId
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