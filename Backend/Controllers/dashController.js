// i define routes in routes folder and the functionlaity with callbacks fucntions declaring status and messages go here
import { v4 as uuidv4 } from "uuid";
import Study from '../Models/studyModel.js';
import Session from '../Models/participantModel.js';
import StudyInvitation from '../Models/invitationModel.js';
import crypto from "crypto";
import checkStudyAuthorization from "../Utils/authHelperFunction.js";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',  // or any other email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

// @desc Get all studies
// @route GET /api/studies
// @access Private (after auth is added)
// add paginaiton, sort, filter
const getAllStudies = async (req, res, next ) => {
   try {
    const studies = await Study.find({ creator: req.user._id });
    res.status(200).json(studies);
   } catch (error) {
    next(error);
   }
};

// @desc Delete a study
// @route DELETE /api/studies/:studyId
// @access Private (after auth is added)
// IMPORTANT THE REQ.PARAMS.STUDYID i think i need to use this oen for the postman
const deleteStudy = async (req, res, next) => {
    try {
        const {studyId} = req.params;
       
        //check if the logged-in user is the creator of the study
        await checkStudyAuthorization(studyId, req.user._id, "delete");
        
        await Study.findByIdAndDelete(studyId);
        res.status(200).json({message: 'Study deleted seccessfully'});
    } catch (error) {
        next(error);
    }
};

// @desc Get responses for a study (for export page)
// @route GET /api/studies/:studyId/responses
// @access Private
const getResponses = async (req, res, next) => {
    try {
        const { studyId } = req.params;
        
        //check if the logged-in user is the creator of the study
        await checkStudyAuthorization(studyId, req.user._id, "access responses for");
        
        const sessions = await Session.find({ studyId: studyId });

        if (!sessions || sessions.length === 0) {
            return res.status(200).json({
                data: [],
                message: 'No responses found for this study'
            }); 
        }

        res.status(200).json({
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        next(error);
    }
};


// @desc update status of the study (publish/unpubloshed)
// @route PATCH /api/studies/:studyId/public
// @access Private (after auth is added)
// what if i have shared that that study and then unplish ti after some time
// have logcs so that the study is not accessible to participants after some time maybe?
const updateStudyStatus = async (req, res, next) => {
   try {
    const {studyId} = req.params;
    const {published} = req.body;
    
    // Check authorization and get the study
    const study = await checkStudyAuthorization(studyId, req.user._id, "update");

    // after finding the right study, update its status
    study.published = published;
    await study.save();

    res.status(200).json({
        message: published
        ? `Study is now available, Get URL link to share  with Others!`
        : `Study has been unpublsihed and is no longer available to participants`,
        data: {
            studyId: study._id,
            title: study.title,
            published: study.published
        }
    });
   } catch (error) {
    next(error);
   }
}

// @desc generate a URL link to publish that quiz
// @route POST /api/studies/:studyId/generate-link
// IDONT TUHINK THIS GENERATES A UNIQUE URL!!!!
// @access Private (after auth is added)
const generateLink = async (req, res, next) => {
    try {
        const {studyId } = req.params;
        // Add this line to extract description from request body
        const { description } = req.body || {};
       
         // Check authorization and get the study
        const study = await checkStudyAuthorization(studyId, req.user._id, "get url link");

        if (!study.published) {
            const error = new Error('Cannot generate link for unpublished study');
            error.statusCode = 400;
            return next(error);
        }

        // Generate a unique access token for this link
        const accessToken = generateRandomToken(16);
        const shortId = study.accessTokens.length + 1; // Simple sequential numbering
          // Initialize accessTokens array if it doesn't exist
          if (!study.accessTokens) {
            study.accessTokens = [];
        }
        
        // Add the new token to the array
        study.accessTokens.push({
            token: accessToken,
            description: description || `Link ${shortId}`,
            active: true
        });

        await study.save();

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
        const studyUrl = `${baseUrl}/participate/${studyId}/${shortId}`;

        res.status(200).json({
            message: 'Study link generated succesfully',
            title: study.title,
            studyUrl: studyUrl,
            description: description || `Link ${shortId}`
        });
    } catch (error) {
        next(error);
    }
};

// helper funciton -> which align with what lefti sayd to generate a uniqye token to trakc users
const generateRandomToken = (bytes = 20) => {
    // improved implementaiton to cryptographically secure
    return crypto.randomBytes(bytes).toString('hex');
    //return [...Array(bytes)]
      /*.map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0'))
      .join('');*/
  };
// @desc Add participants via email
// @route POST /api/studies/:studyId/participants
// @access Private (after auth is added)
/*const emailInvitaitons = async (req, res, next) => {
    try {
    const {studyId} = req.params;
    const { emails } = req.body;
    // Validate that emails exists, is an array, and isn't empty
    // This is important because we want to process multiple email invitations at once
    // The frontend should send: { "emails": ["user1@example.com", "user2@example.com"] }
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        const error = new Error('Please provide an array of email addresses');
        error.statusCode = 400;
        return next(error);
      }

      // Check authorization and get the study
        const study = await checkStudyAuthorization(studyId, req.user._id, "invate");

     if (!study.published) {
        const error = new Error('Cannot invite pariticpants to an unpublished study');
        error.statusCode = 400;
        return next(error);
     }

     //create invitation records for each email
     const invitations = [];

     for (const email of emails) {
        //generate a unique token for eahc invitation
        // NEED TO FIND IFNO REGARIDNG THIS
        const invitationToken = generateRandomToken();

        const invitation = new StudyInvitation({
            studyId,
            email,
            invitationToken,
            status: 'pending'
        });
        await invitation.save(); // This line causes multiple sequential DB operations
        invitations.push(invitation);
     }
     res.status(200).json({
        message: `${emails.length} participants have been invited to the study`,
        studyId,
        invitationCount: invitations.length
     });
    } catch (error) {
        next(error);
    }
    
};*/
// BETTER APPROACH 
const emailInvitaitons = async (req, res, next) => {
    try {
        const { studyId } = req.params;
        const { emails } = req.body;
        
        // Email validation
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            const error = new Error('Please provide an array of email addresses');
            error.statusCode = 400;
            return next(error);
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emails.filter(email => !emailRegex.test(email));
        
        if (invalidEmails.length > 0) {
            const error = new Error(`Invalid email format: ${invalidEmails.join(', ')}`);
            error.statusCode = 400;
            return next(error);
        }
        
        // Check authorization
        const study = await checkStudyAuthorization(studyId, req.user._id, "invite");
        
        if (!study.published) {
            const error = new Error('Cannot invite participants to an unpublished study');
            error.statusCode = 400;
            return next(error);
        }
        
        // Prepare invitation documents for bulk insert
        const invitationDocs = emails.map(email => ({
            studyId,
            email,
            invitationToken: generateRandomToken(),
            status: 'pending'
        }));
        
        // Bulk insert all invitations in a single DB operation
        const invitations = await StudyInvitation.insertMany(invitationDocs);
        
        // TODO: Trigger email sending here (separate service)
          // Email sending implementation
          let sentCount = 0;
          let errorCount = 0;
          
          // Use Promise.all to send all emails in parallel
          await Promise.all(invitations.map(async (invitation) => {
              try {
                  // Create email content
                  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
                  const participateUrl = `${baseUrl}/participate/${studyId}?token=${invitation.invitationToken}`;
                  
                  const mailOptions = {
                      from: process.env.EMAIL_USER,
                      to: invitation.email,
                      subject: `Invitation to participate in study: ${study.title}`,
                      html: `
                          <h1>You're invited to participate in a study</h1>
                          <p>You have been invited to participate in the study "${study.title}".</p>
                          <p>${study.description || ''}</p>
                          <p>Click the link below to start:</p>
                          <a href="${participateUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
                              Participate in Study
                          </a>
                          <p>Or copy and paste this URL into your browser:</p>
                          <p>${participateUrl}</p>
                      `
                  };
                  
                  // Send the email
                  await transporter.sendMail(mailOptions);
                  
                  // Update invitation status
                  invitation.status = 'sent';
                  invitation.sentAt = new Date();
                  await invitation.save();
                  
                  sentCount++;
              } catch (emailError) {
                  console.error(`Failed to send email to ${invitation.email}:`, emailError);
                  errorCount++;
              }
          }));
        
        res.status(201).json({  // 201 Created is more appropriate than 200 OK
            message: `${emails.length} participants have been invited to the study`,
            studyId,
            invitationCount: invitations.length
        });
    } catch (error) {
        next(error);
    }
};

export const dashController = {
    getAllStudies,
    deleteStudy,
    getResponses,
    generateLink,
    emailInvitaitons,
    updateStudyStatus
};

