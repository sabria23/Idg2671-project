// i define routes in routes folder and the functionlaity with callbacks fucntions declaring status and messages go here
import { v4 as uuidv4 } from "uuid";
import Study from '../Models/studyModel.js';
import Session from '../Models/participantModel.js';
import StudyInvitation from '../Models/invitationModel.js';
import crypto from "crypto";
import checkStudyAuthorization from "../Utils/authHelperFunction.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendStudyInvitation } from "../Utils/emailService.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Controller .env path:', path.join(__dirname, '../../.env'));

const result = dotenv.config({ path: path.join(__dirname, '../../.env') });

/*
As a student, cost is definitely an important factor! Here's a breakdown of the cost-free options:
Free options for development:

Ethereal Mail: Completely free for development. It creates disposable test accounts and captures emails without sending them.
Shared development email: You could create a free Gmail account specifically for development that all team members share.

Free/low-cost options for production:

SendGrid: Has a free tier with 100 emails per day
Mailgun: Has a free trial with 5,000 emails for 3 months
Brevo (formerly Sendinblue): Free tier with 300 emails per day

Regarding OAuth2 with Gmail:

This is free to implement but requires some setup with Google Cloud Console
Good for letting users authorize your app to send on their behalf without storing passwords

For a student project, I'd recommend:

Use Ethereal for development (completely free)
For production, either use SendGrid's free tier or implement the "users provide their credentials" approach
*/
/*const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use secure port
    secure: true, // Use SSL/TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger: true,
    debug: true
  });
  console.log('Environment Variables in DashController:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Password is set' : 'Password is NOT set');
  // Add this before your email sending block
console.log('Email Configuration:', {
    user: process.env.EMAIL_USER,
    host: 'smtp.gmail.com',
    port: 465
});*/

// @desc Get all studies
// @route GET /api/studies
// @access Private (after auth is added)
// add paginaiton, sort, filter -> The getAllStudies controller has been upgraded to support:
/*Pagination: Using skip and limit parameters
Sorting: Dynamic sort fields with ascending/descending options
Filtering: By publication status (published/draft/all)
Metadata: Returns comprehensive pagination data for the frontend

Key best practices implemented:

Parameter Validation: Ensures page and limit are positive numbers
Default Values: Sensible defaults for all parameters
Lean Queries: Uses lean() for improved performance
Consistent Response Format: Structured response with metadata and data separation
Error Handling: Proper error passing to next middleware*/
const getAllStudies = async (req, res, next ) => {
  try {
    // Extract query parameters with defaults
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status
    } = req.query;

    // Convert string values to appropriate types
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Validate page and limit to prevent negative values
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Page and limit must be positive numbers' 
      });
    }
    
    // Base query - find studies created by the current user
    const query = { creator: req.user._id };
    
    // Add status filter if provided
    if (status === 'published') {
      query.published = true;
    } else if (status === 'draft') {
      query.published = false;
    }
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination metadata
    const totalStudies = await Study.countDocuments(query);
    
    // Create sort object - handle both single field and multiple fields
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination, sorting, and filtering
    const studies = await Study.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for better performance on read-only data
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalStudies / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    // Return studies with pagination metadata
    res.status(200).json({
      success: true,
      data: studies,
      pagination: {
        totalStudies,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        status: status || 'all'
      },
      sorting: {
        sortBy,
        sortOrder
      }
    });
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
/*const generateLink = async (req, res, next) => {
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

        /*Generate a unique access token for this link
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

        await study.save();*/

        // Optional: Generate a shorter link or track link usage
    // This is where you could add code to create a shortened URL or track link clicks
    
    // Optional: Store link information in the database
    // For example, to track when it was generated, by whom, etc.

        /*const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
        const studyUrl = `${baseUrl}/public/study/${studyId}`;

        res.status(200).json({
          success: true,
          message: 'Study link generated successfully',
          title: study.title,
          studyUrl: studyUrl,
          data: {
            shareableUrl: studyUrl  // Add this to match frontend expectations
          }
              // You could also add other fields like:
        // expiresAt: null,  // If you want links to expire
        // accessCount: 0,   // If you want to track link usage
            
        });
    } catch (error) {
        next(error);
    }
};*/
const generateLink = async (req, res, next) => {
  try {
    console.log("Generate link endpoint called for studyId:", req.params.studyId);
    
    const { studyId } = req.params;
    
    // Debug user information
    console.log("User making request:", req.user ? req.user._id : "No user");
    
    // Check if studyId is valid
    if (!studyId) {
      return res.status(400).json({
        success: false,
        message: 'Study ID is required'
      });
    }
    
    // Debug step
    console.log("About to check study authorization");
    
    // Check authorization and get the study
    const study = await checkStudyAuthorization(studyId, req.user._id, "get url link");
    
    // Debug study information
    console.log("Study found:", study ? "Yes" : "No");
    console.log("Study published status:", study ? study.published : "N/A");
    
    if (!study) {
      return res.status(404).json({
        success: false,
        message: 'Study not found'
      });
    }
    
    if (!study.published) {
      return res.status(400).json({
        success: false,
        message: 'Cannot generate link for unpublished study'
      });
    }
    
    const baseUrl = process.env.FRONTEND_URL || 'https://group4.sustainability.it.ntnu.no'; // Update with your correct frontend URL
    const studyUrl = `${baseUrl}/public/study/${studyId}`;
    
    console.log("Generated URL:", studyUrl);
    
    return res.status(200).json({
      success: true,
      message: 'Study link generated successfully',
      title: study.title,
      studyUrl: studyUrl,
      data: {
        shareableUrl: studyUrl
      }
    });
  } catch (error) {
    console.error("Error generating link:", error);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to generate link',
      error: error.message
    });
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
/*const emailInvitaitons = async (req, res, next) => {
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
                console.log(`Attempting to send email to: ${invitation.email}`);
                  // Create email content
                  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
                  const participateUrl = `${baseUrl}/participate/${studyId}?token=${invitation.invitationToken}`;
                  // https://www.youtube.com/watch?v=FT-AiOcw-50
                  const mailOptions = {
                      from: `"Study Platform" <${process.env.EMAIL_USER}>`, // System email address
                      //replyTo: researcher.email, // Researcher's email for replies
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
                  console.log(`Email sent successfully to: ${invitation.email}`);

                  // Update invitation status
                  invitation.status = 'sent';
                  invitation.sentAt = new Date();
                  await invitation.save();
                  
                  sentCount++;
              } catch (emailError) {
                  console.error(`Failed to send email to ${invitation.email}:`, {
                    message: emailError.message,
                    code: emailError.code
                  });
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
};*/

/*
This approach:

Uses a much simpler data model
Still tracks essential information
Provides success/failure counts
Maintains a record of sent invitations*/
export const emailInvitaitons = async (req, res) => {
  // Add these debug logs at the very beginning
  console.log("------- Email Invitations Debug -------");
  console.log("User from auth middleware:", req.user ? req.user._id : "No user");
  
  try {
    const { studyId } = req.params;
    // Add this debug log
    console.log("Study ID from params:", studyId);
    
    const { emails, subject, message } = req.body;
    
    // Add this code to check if the study exists at all
    const anyStudy = await Study.findById(studyId);
    console.log("Study exists in DB:", anyStudy ? "Yes" : "No");
    
    if (anyStudy) {
      console.log("Study published status:", anyStudy.published);
      console.log("Study creator:", anyStudy.creator);
      console.log("Current user:", req.user._id);
      console.log("Creator matches current user:", 
        anyStudy.creator.toString() === req.user._id.toString());
    }
    
    // Your original validation
    const study = await Study.findOne({
      _id: studyId,
      published: true
    });
    
    // Add this debug log
    console.log("Study found with all criteria:", study ? "Yes" : "No");
    
    if (!study) {
      // Add this debug log
      console.log("Study validation failed");
      return res.status(404).json({
        success: false,
        message: 'Study not found or not published'
      });
    }
    
    // Rest of your controller code remains the same
    // Process email list (handle comma or line separated)
    const emailList = emails
      .split(/[\n,]/)
      .map(email => email.trim())
      .filter(email => email.includes('@') && email.length > 5);
      
    if (emailList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid emails provided'
      });
    }
    
    // Get the study link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3030';
    const studyUrl = `${baseUrl}/public/study/${studyId}`;
    
    // Limit to prevent abuse (stay under rate limits)
    const MAX_EMAILS = 50;
    const limitedList = emailList.slice(0, MAX_EMAILS);
    // Generate a unique batch token for this invitation
    const invitationToken = `batch-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Create invitation record
    const invitation = new StudyInvitation({
      studyId,
      subject,
      message,
      sentBy: req.user._id,
      emails: limitedList,
      status: 'pending',
      invitationToken: invitationToken
    });
    
    await invitation.save();
    
    // Send emails
    let successCount = 0;
    let failCount = 0;
    
    for (const email of limitedList) {
      try {
        const result = await sendStudyInvitation(
          email,
          subject,
          message,
          studyUrl + `?token=${invitationToken}` 
        );
        
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        failCount++;
      }
    }
    
    // Update invitation record
    invitation.successCount = successCount;
    invitation.failCount = failCount;
    invitation.status = successCount > 0 ? 'completed' : 'failed';
    invitation.sentAt = new Date();
    
    await invitation.save();
    
    res.status(200).json({
      success: true,
      message: `Invitations sent to ${successCount} recipients. ${failCount} failed.`
    });
  } catch (error) {
    console.error('Error sending invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitations',
      error: error.message
    });
  }
};





// Add this to your controller file (e.g., studyController.js)

/**
 * Access a study as a participant through a public link
 * This controller is used when participants click on a study link
 */
const accessStudyByLink = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    
    // Find study by ID (without authorization check since this is public access)
    const study = await Study.findById(studyId);
    
    // Check if study exists
    if (!study) {
      return res.status(404).json({ 
        success: false, 
        message: "Study not found" 
      });
    }
    
    // Check if study is published
    if (!study.published) {
      return res.status(403).json({
        success: false,
        message: "This study is currently unavailable or has been unpublished by the researcher"
      });
    }
    
    // If study is published, return study data for participants
    // Note: You may want to filter what data is returned here based on what participants should see
    res.status(200).json({
      success: true,
      data: {
        studyId: study._id,
        title: study.title,
        description: study.description,
      }
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
    updateStudyStatus,
    accessStudyByLink
};

