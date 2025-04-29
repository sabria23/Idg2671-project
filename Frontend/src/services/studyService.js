// https://scrapingant.com/blog/axios-vs-fetch
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// get auth token
const getToken = () => {
    return localStorage.getItem('token');
};

// endpoint from backend to: GET all studies for the dashboard to display
// studyRouter.get('/', protect,  dashController.getAllStudies);
export const getAllStudies = async () => {
    try {
        const response = await axios.get(`${API_URL}/studies`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
//studyRouter.delete('/:studyId', protect, dashController.deleteStudy);
export const deleteStudy = async (studyId) => { // take in that specific studyId parameter
    try {
        const response = await axios.delete(`${API_URL}/studies/${studyId}`, {
            headers: { Authorization: `Bearer ${getToken()}`}
        });
        return response.data
    } catch (error) {
        throw error;
    }
}


//studyRouter.get('/:studyId/sessions/responses', protect, dashController.getResponses);
export const getResponses = async (studyId) => {
    try {
        const response = await axios.get(`${API_URL}/studies/${studyId}/sessions/:sessionId/results`, {
            headers: {Authorization: `Bearer ${getToken()}`}
        });
        return response.data
    } catch (error) {
        throw error;
    }
}


//studyRouter.patch('/:studyId/public', protect, validatePublishStatus, dashController.updateStudyStatus);
// update study publication status
export const updateStudyPublicStatus = async (studyId, published) => {
    try {
        const response = await axios.patch(`${API_URL}/studies/${studyId}`, 
            { published },
            {
                headers: { Authorization: `Bearer ${getToken()}` }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
//studyRouter.post('/:studyId/public-url', protect, dashController.generateLink);
// Generate study participation link
export const generateStudyLink = async (studyId) => {
    try {
        const response = await axios.post(`${API_URL}/studies/${studyId}/link`, 
            {},
            {
                headers: { Authorization: `Bearer ${getToken()}` }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

//studyRouter.post('/:studyId/invitations', protect, dashController.emailInvitaitons);
// Send email invitations
export const sendEmailInvitations = async (studyId, emails) => {
    try {
        const response = await axios.post(`${API_URL}/studies/${studyId}/invitations`, 
            { emails },
            {
                headers: { Authorization: `Bearer ${getToken()}` }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get study by ID -> for publishing study purposes
export const getStudyById = async (studyId) => {
    try {
        const response = await axios.get(`${API_URL}/studies/${studyId}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getAllStudies,
    deleteStudy,
    getResponses,
    updateStudyPublicStatus,
    generateStudyLink,
    sendEmailInvitations,
    getStudyById
};


