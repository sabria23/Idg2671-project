import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/auth';

// Login user
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
    
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
    const response = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
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
    
    const response = await axios.get(`${API_URL}/api/auth/user`, {
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


