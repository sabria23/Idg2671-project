import crypto from 'crypto';
import Study from "../Models/studyModel.js"
import Session from "../Models/participantModel.js";

//@desc retrieve and return study's data fro paritipants
// @route GET /api/studies//:studyId/survey
export const getSurvey = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { sessionId, resume, page: pageStr = '0' } = req.query;

    // 1) Load study & populate artifact refs
    const study = await Study
      .findById(studyId)
      .populate('questions.fileContent.fileId', 'fileUrl fileType');
    if (!study) {
      const err = new Error('Study not found');
      err.statusCode = 404;
      throw err;
    }
    if (!study.published) {
      const err = new Error('This study is not available');
      err.statusCode = 403;
      throw err;
    }

    const totalQuestions = study.questions.length;

    // 2) Determine which page to serve (resume or explicit)
    let page;
    if (resume === 'true' && sessionId) {
      const session = await Session.findById(sessionId);
      const answered = session?.responses.length || 0;
      page = Math.min(answered, totalQuestions - 1);
    } else {
      page = parseInt(pageStr, 10);
    }

    if (page < 0 || page >= totalQuestions) {
      const err = new Error('Invalid page number');
      err.statusCode = 400;
      throw err;
    }

    // 3) Extract and reshape the question
    const raw = study.questions[page];
    // Map fileContent → artifacts array of Artifact docs
    const artifacts = raw.fileContent.map(fc => fc.fileId);

    const question = {
      _id: raw._id,
      questionText: raw.questionText,
      questionType: raw.questionType,
      layout: raw.layout,
      options: raw.options,
      fileContent: raw.fileContent,
      artifacts
    };

    // 4) Find the last response for this question (if any)
    let previousAnswer = null;
    let previousResponseId = null;
    let skipped = false;
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (session) {
        const matches = session.responses.filter(r =>
          r.questionId.toString() === question._id.toString()
        );
        if (matches.length) {
          const last = matches[matches.length - 1];
          previousAnswer     = last.participantAnswer;
          previousResponseId = last._id;
          skipped            = last.skipped;
        }
      }
    }

    // 5) Send everything the front-end needs
    res.status(200).json({
      id: study._id,
      title: study.title,
      description: study.description,
      question,
      currentIndex: page,
      totalQuestions,
      previousAnswer,
      previousResponseId,
      skipped,
      demographics: study.demographics // Include demographics configuration
    });
  } catch (err) {
    next(err);
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
// @desc update session data
// @route PATCH /api/studies/:studyId/sessions/:sessionId
export const updateSession = async (req, res, next) => {
  try {
    const { studyId, sessionId } = req.params;
    const { demographics } = req.body;

    // Validate input
    if (!demographics || typeof demographics !== 'object') {
      return res.status(400).json({ message: 'No demographic data provided' });
    }

    // Find the session and ensure it belongs to the study
    const session = await Session.findOne({ _id: sessionId, studyId });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Optional: block update if session is already completed
    if (session.isCompleted) {
      return res.status(403).json({ message: 'Cannot update a completed session' });
    }

    // Update only the demographics field
    session.demographics = {
      ...session.demographics,
      ...demographics
    };

    await session.save();

    res.status(200).json({ message: 'Session updated successfully' });
  } catch (err) {
    next(err);
  }
};


// @desc save participant's answer related to quesitons
// @route POST /api/studies/:studyid/sessions/:sessionId/:questionId
export const submitAnswer = async (req, res, next) => {
  console.log('submitAnswer req.body:', req.body);
  try {
    const { studyId, sessionId } = req.params;
    const {
      responseId,                    // ← may be undefined on first save
      questionId,
      participantAnswer: answer,
      skipped = false,
      answerType
    } = req.body;

    if (!questionId) {
      const err = new Error('Missing questionId');
      err.statusCode = 400;
      throw err;
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      throw err;
    }

    const study = await Study.findById(studyId);
    if (!study) {
      const err = new Error('Study not found');
      err.statusCode = 404;
      throw err;
    }

    const exists = Array.isArray(study.questions) &&
      study.questions.some(q => q._id.toString() === questionId.toString());
    if (!exists) {
      const err = new Error('Question not in study');
      err.statusCode = 404;
      throw err;
    }

    // ————— If they sent an existing responseId, UPDATE that entry —————
    if (responseId) {
      await Session.updateOne(
        { _id: sessionId, 'responses._id': responseId },
        {
          $set: {
            'responses.$.participantAnswer': skipped ? null : answer,
            'responses.$.skipped': Boolean(skipped),
            'responses.$.answerType': answerType
          }
        }
      );
      return res.json({ message: 'Answer updated', responseId });
    }

    // ————— Otherwise, PUSH a new response and return its _id —————
    session.responses.push({
      questionId,
      participantAnswer: skipped ? null : answer,
      answerType,
      skipped: Boolean(skipped)
    });
    await session.save();
    const created = session.responses[session.responses.length - 1];
    res.status(201).json({
      message: 'Answer submitted',
      responseId: created._id
    });

  } catch (err) {
    next(err);
  }
};

// @desc Change answer to user, if they what to update their answer
//@route PATCH /api/studies/:studyid/sessions/:sessionId/:questionId
export const updateAnswer = async (req, res, next) => {
  try {
    const { sessionId, responseId } = req.params;             // ← use responseId
    const {
      participantAnswer: answer,
      skipped = false,
      answerType
    } = req.body;

    // Load the session
    const session = await Session.findById(sessionId);
    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      throw err;
    }

    // Find the specific response subdoc by its _id
    const resp = session.responses.id(responseId);
    if (!resp) {
      const err = new Error('Answer not found');
      err.statusCode = 404;
      throw err;
    }

    // Update it in‐place
    resp.participantAnswer = skipped ? null : answer;
    resp.skipped           = Boolean(skipped);
    resp.answerType        = answerType;

    await session.save();

    res.status(200).json({
      message: 'Answer updated',
      responseId: resp._id
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

// Controller to handle saving demographics data to a session
// surveyRouter.post('/:studyId/sessions/:sessionId/demographics', saveDemographicsData);
export const saveDemographicsData = async (req, res) => {
  try {
    const { studyId, sessionId } = req.params;
    const demographicsData = req.body;
    
    // Find the session
    const session = await Session.findOne({ 
      _id: sessionId,
      studyId
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Convert demographics data to Map
    const demographicsMap = new Map();
    
    for (const [key, value] of Object.entries(demographicsData)) {
      demographicsMap.set(key, value);
    }
    
    // Update session with demographics data
    session.demographics = demographicsMap;
    await session.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving demographics data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};