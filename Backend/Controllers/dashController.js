// i define routes in routes folder and the functionlaity with callbacks fucntions declaring status and messages go here
import { v4 as uuidv4 } from "uuid";
import Study from '../Models/studyModel.js';
import Session from '../Models/participantModel.js';
import StudyInvitation from '../Models/invitationModel.js';


// @desc Get all studies
// @route GET /api/studies
// @access Private (after auth is added)
const getAllStudies = async (req, res, next ) => {
   try {
    const studies = await Study.find();
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
        const study = await Study.findById(studyId);
        if (!study) {
            const error = new Error('Study not found');
            error.statusCode = 404;
            return next(error);
        }
        //check if the logged-in user is the creator of the study
        // the study.creator menaing study colelction attribute creator, toString convert the ID to string,
        // req.user._id => menainf find the request parameter from the user collection's id generetd by mongodb
        // set it also to string (ha begge som string i tilfelle en er stringog en er object sånn at == faktisk fungere som er like)
        //UNCOMMENT THIS ONCE IT IS WORKING
        /*if (study.creator.toString() !== req.user._id.toString()) {
            const error = new Error('Not authorized to delete this study');
            error.statusCode = 403;
            return next(error);
        }*/
        await Study.findByIdAndDelete(studyId);

        res.status(200).json({message: 'Study deleted seccessfully'});
    } catch (error) {
        next(error);
    }
};

// @desc Get responses for a study (for export page)
// @route GET /api/studies/:studyId/responses
// @access Private (after auth is added)
// Consider adding pagination if you expect a large number of responses
const getResponses = async (req, res, next) => {
    try {
        const { studyId } = req.params;
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
    //validation that published is a boolean => i think this sort of validaiton can go in the validator 
    if (typeof published !== 'boolean') {
        const error = new Error('Published status must be a boolean value');
        error.statusCode = 400;
        return next(error);
    }

    const study = await Study.findById(studyId);
    if (!study) {
        const error = new Error('Study not found');
        error.statusCode = 404;
        return next(error);
    }
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
        const study = await Study.findById(studyId);
        if (!study) {
            const error = new Error('study not found');
            error.statusCode = 404;
            return next(error);
        }

        if (!study.published) {
            const error = new Error('Cannot generate link for unpublished study');
            error.statusCode = 400;
            return next(error);
        }

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
        const studyUrl = `${baseUrl}/participate/${studyId}`;

        res.status(200).json({
            message: 'Study link generated succesfully',
            title: study.title,
            studyUrl: studyUrl
        });
    } catch (error) {
        next(error);
    }
};

// @desc Add participants via email
// @route POST /api/studies/:studyId/participants
// @access Private (after auth is added)
const emailInvitaitons = async (req, res, next) => {
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
     const study = await Study.findById(studyId);
     if (!study) {
        const error = new Error('Study not found');
        error.statusCode = 404;
        return next(error);
     }

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
        const invitationToken = crypto.randomBytes(20).toString('hex');

        const invitation = new StudyInvitation({
            studyId,
            email,
            invitationToken,
            status: 'pending'
        });
        await invitation.save();
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
    
};

export const dashController = {
    getAllStudies,
    deleteStudy,
    getResponses,
    generateLink,
    emailInvitaitons,
    updateStudyStatus
};

