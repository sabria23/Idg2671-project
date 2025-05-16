import axios from 'axios';
const API_URL = 'https://group4-api.sustainability.it.ntnu.no' || 'http://localhost:8000';

// Login user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`https://group4-api.sustainability.it.ntnu.no/api/auth/login`, { username, password });
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Register user
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`https://group4-api.sustainability.it.ntnu.no/api/auth/register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// @route GET /api/auth/user 
// @desc return current user data -> for the username to be dispalyed purpose
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const response = await axios.get(`https://group4-api.sustainability.it.ntnu.no/api/auth/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  // You could also call the logout API endpoint here if needed
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export default {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  isAuthenticated
};


