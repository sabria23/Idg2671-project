import crypto from 'crypto';

import Study from "../Models/studyModel.js"
import Session from "../Models/participantModel.js";

//@desc retrieve and return study's data fro paritipants
// @route GET /api/studies//:studyId/survey
export const getSurvey = async (req, res, next) => {
    try {
        const {studyId} = req.params;
        const {sessionId} = req.query; //get session id in case the user already has a session
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
        error.statusCode = 400;
        throw error;
       }

       const question = study.questions[page]

       let previousResponse = null;
        if (sessionId) {
            const session = await Session.findById(sessionId);
        if (session) {
            previousResponse = session.responses.find(
            r => r.questionId.toString() === question._id.toString()
            );
      }
    }

       // Send the survey data INCOMPLETE
       res.status(200).json({
        id: study._id,
        title: study.title,
        descirption: study.description,
        question,
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
        const {deviceInfo, demographics, invitationToken} = req.body;
        // validaitng the study
        const study = await Study.findById(studyId);
        if (!study || !study.published) {
            const error = new Error('Study not found or not available');
            error.statusCode = 404;
            throw error;
        }

        // Check invitation if token provided
        let invitationId = null;
        if (invitationToken) {
            const invitation = await StudyInvitation.findOne({
                studyId,
                invitationToken,
                status: { $in: ['pending', 'sent'] }
            });

            if (invitation) {
                invitationId = invitation._id;
                // Update invitation status
                invitation.status = 'sent';
                invitation.sentAt = new Date();
                await invitation.save();
            }
        }

         // Create a secure session token
         const sessionToken = crypto.randomBytes(20).toString('hex');

         // Validate demographics if provided
         if (demographics) {
             // Add validation for demographics here
             // For example, check if age and gender are valid enum values
         }


        //  make new session
        const session = new Session({
            studyId,
            invitationId,
            sessionToken,
            deviceInfo,
            demographics: demographics || {},
            isCompleted: false,
            responses: []
        });

        await session.save();

        res.status(201).json({
            message: 'Session created successfully',
            sessionId: session._id,
            sessionToken
        });
    } catch (err) {
        next(err);
    }
};

// @desc save participant's answer related to quesitons
// @route POST /api/studies/:studyid/sessions/:sessionId/:questionId
export const submitAnswer = async (req, res, next) => {
    try {
        const {studyId, sessionId, questionId} = req.params;
        const {answer, skipped, answerType} = req.body;

        const session = await Session.findById(sessionId);
        if (!session) {
            const error = new Error('Session not found');
            error.statusCode = 404;
            throw error;
        }
        console.log('studyId:', studyId)
        const study = await Study.findById(studyId);
        if (!study) {
            const error = new Error('Study not found');
            error.statusCode = 404;
            throw error;
            
        }

        const questionExists = study.questions.find(
            q => q._id.toString() === questionId
        );
        if (!questionExists) {
            const error = new Error('Question not found in this study');
            error.statusCode = 400;
            throw error;
        }

        const existingResponse = session.responses.find(
            r => r.questionId.toString() === questionId
        );
        if (existingResponse) {
            const error = new Error('Answer already submitted. Use update instead.');
            error.statusCode = 409;
            throw error;
        }

        // after you chekced that only then you can add the responses (as done below)
        session.responses.push({
            questionId,
            participantAnswer: skipped ? null : answer,
            answerType: answerType,
            skipped: !!skipped
        });

        await session.save();

        res.status(201).json({
            message: 'Answer submitted',
            sessionId: session._id
        });
    } catch (err) {
        next(err);
    }
};

// @desc Change answer to user, if they what to update their answer
//@route PATCH /api/studies/:studyid/sessions/:sessionId/:questionId
export const updateAnswer = async (req, res, next) => {
    try {
        const {sessionId, questionId} = req.params;
        const {answer, answerType, skipped} = req.body;

        const session = await Session.findById(sessionId);
        if (!session) {
            const error = new Error('Session not found');
            error.statusCode = 404;
            throw error;
        }

        const response = session.responses.find(
            r => r.questionId.toString() === questionId
        );

        if (!response) {
            const error = new Error('Answer not found');
            error.statusCode = 404;
            throw error; 
        }
        
        response.participantAnswer = skipped ? null : answer;
        response.answerType = answerType;
        response.skipped = !!skipped;

        await session.save();

        res.status(201).json({
            message: 'Answer updated',
            responses: session.responses
        });        
    } catch (err) {
        next(err);
    }
};


export const completeSession = async (req, res, next) => {
    try {
      const { sessionId } = req.params;

      const session = await Session.findById(sessionId);
        if (!session) {
            const error = new Error('Session not found');
            error.statusCode = 404;
            throw error;
        }
        session.isCompleted = true;
        await session.save();
        res.status(200).json({
            message: 'Session completed successfully',
            sessionId: session._id
        });
    } catch (err) {
        next(err);
    }
};