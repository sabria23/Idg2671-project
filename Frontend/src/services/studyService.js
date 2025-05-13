// https://scrapingant.com/blog/axios-vs-fetch
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// get auth token
const getToken = () => {
    return localStorage.getItem('token');
};

// endpoint from backend to: GET all studies for the dashboard to display
// studyRouter.get('/', protect,  dashController.getAllStudies);
export const getAllStudies = async ({ 
  page = 1, 
  limit = 10, 
  sortBy = 'createdAt', 
  sortOrder = 'desc',
  status = null
} = {}) => {
    try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        
        if (status && status !== 'all') {
            params.append('status', status);
        }
        
        const response = await axios.get(`${API_URL}/api/studies?${params.toString()}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching studies:', error);
        throw error;
    }
};
//studyRouter.delete('/:studyId', protect, dashController.deleteStudy);
export const deleteStudy = async (studyId) => { // take in that specific studyId parameter
    try {
        const response = await axios.delete(`${API_URL}/api/studies/${studyId}`, {
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
        const response = await axios.get(`${API_URL}/api/studies/${studyId}/sessions/:sessionId/results`, {
            headers: {Authorization: `Bearer ${getToken()}`}
        });
        return response.data
    } catch (error) {
        throw error;
    }
}


//studyRouter.patch('/:studyId/public', protect, validatePublishStatus, dashController.updateStudyStatus);
// update study publication status
export const updateStudyStatus = async (studyId, published) => {
    try {
        const response = await axios.patch(`${API_URL}/api/studies/${studyId}`, 
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
        const response = await axios.post(`${API_URL}/api/studies/${studyId}/link`, 
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
        const response = await axios.post(`${API_URL}/api/studies/${studyId}/invitations`, 
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
        const response = await axios.get(`${API_URL}/api/studies/${studyId}`, {
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
    updateStudyStatus,
    generateStudyLink,
    sendEmailInvitations,
    getStudyById
};


