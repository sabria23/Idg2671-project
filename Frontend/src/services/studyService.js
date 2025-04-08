import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// get auth token
const getToken = () => {
    return localStorage.getItem('token');
};

// endpoint from backend to: GET all studies for the dashboard to display
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

export default {
    getAllStudies
};