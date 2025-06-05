import axios from 'axios';

const API_URL = 'https://group4-api.sustainability.it.ntnu.no' || 'http://localhost:8000';
const getToken = () => localStorage.getItem('token');

// Upload artifacts
export const uploadArtifacts = async (files) =>{
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const res = await axios.post(`${API_URL}/api/artifacts`, formData, {
    headers:{
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.files || [];
};

// Fetch all artifacts
export const fetchAllArtifacts = async () =>{
  const res = await axios.get(`${API_URL}/api/artifacts`, {
    headers:{
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data || [];
};

// Get a single artifact as blob url
export const fetchArtifactById = async (artifactId) =>{
  const res = await fetch(`${API_URL}/api/artifacts/${artifactId}/view`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

// Delete artifacts
export const deleteArtifact = async (artifactId) =>{
  await axios.delete(`${API_URL}/api/artifacts/${artifactId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export default {
  uploadArtifacts,
  fetchAllArtifacts,
  fetchArtifactById,
  deleteArtifact,
};