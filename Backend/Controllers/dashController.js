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
const result = dotenv.config({ path: path.join(__dirname, '../../.env') });

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

const generateLink = async (req, res, next) => {
  try {
    const { studyId } = req.params;
  
    if (!studyId) {
      return res.status(400).json({
        success: false,
        message: 'Study ID is required'
      });
    }

    
    // Check authorization and get the study
    const study = await checkStudyAuthorization(studyId, req.user._id, "get url link");

    
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
export const emailInvitaitons = async (req, res) => {  
  try {
    const { studyId } = req.params;
    // Add this debug log
    console.log("Study ID from params:", studyId);
    
    const { emails, subject, message } = req.body;
    
    // Add this code to check if the study exists at all
    const anyStudy = await Study.findById(studyId);
    
    if (anyStudy) {
        anyStudy.creator.toString() === req.user._id.toString();
    }
    
    // Your original validation
    const study = await Study.findOne({
      _id: studyId,
      published: true
    });
    
    
    if (!study) {
      return res.status(404).json({
        success: false,
        message: 'Study not found or not published'
      });
    }
    
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

