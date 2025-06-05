import axios from 'axios';

const API_URL = 'https://group4-api.sustainability.it.ntnu.no' || 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');

// For creating a new study
export const createStudy = async (FormData) =>{
  try{
    const res = await axios.post(`${API_URL}/api/studies`, FormData, {
      headers:{
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }catch (err){
    console.error('Error creating study:', err);
    throw err;
  }
};

// Update a existing study
export const updateStudy = async (getStudyById, formData) =>{
  try{
    const res = await axios.patch(`${API_URL}/api/studies/${studyId}`, formData, {
      headers:{
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }catch (err){
    console.error('Error updating study:', err);
    throw err;
  }
};

// Fetch a study by id
export const fetchStudy = async (studyId) =>{
  try{
    const res = await axios.get(`${API_URL}/api/studies/${studyId}`, {
      headers:{
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  }catch (err){
    console.error('error fetching study:', err);
    throw err;
  }
};

export default{
  createStudy,
  updateStudy,
  fetchStudy,
};