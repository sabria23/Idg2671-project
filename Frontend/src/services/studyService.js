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
export default {
    getAllStudies,
    deleteStudy
};



//studyRouter.get('/:studyId/sessions/responses', protect, dashController.getResponses);
//studyRouter.patch('/:studyId/public', protect, validatePublishStatus, dashController.updateStudyStatus);
//studyRouter.post('/:studyId/public-url', protect, dashController.generateLink);
//studyRouter.post('/:studyId/invitations', protect, dashController.emailInvitaitons);