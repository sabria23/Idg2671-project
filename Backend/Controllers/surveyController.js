import Study from "../Models/studyModel.js"
import Participant from "../Models/participantModel.js";

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

// Creates the participant for the participant
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
        let participant = await Participant.findOne({
            study: studyId,
            participantId,
            isComplete: false
        });

        // If there is a session resume
        if (participant) {
            return res.status(200).json({
                message: 'Resumed session',
                participant
            });
        }

        // If not then make new one
        participant = new Participant({
            study: studyId,
            participantId
        });

        await participant.save();

        res.status(201).json({
            message: 'New session created',
            participant
        });
    } catch (err) {
        next(err);
    }
};

// Save a participant wuestion
export const submitAnswer = async (req, res, next) => {
    try {
        const {studyId, participantId, questionId} = req.params;
        const {answer, skipped} = req.body;

        const participant = await Participant.findOne({study: studyId, participantId});
        if (!participant) {
            const error = new Error('participant not found');
            error.statusCode = 404;
            throw error;
        }

        participant.responses.push({
            questionId,
            participantAnswer: skipped ? null : answer,
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


//export const completeparticipant = async (req, res, next) => {
//    try {
//        
//    } catch (err) {
//        next(err);
//    }
//};