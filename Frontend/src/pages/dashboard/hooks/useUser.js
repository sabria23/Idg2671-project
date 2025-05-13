// hooks/useUser.js
import { useState, useEffect } from 'react';
import { getCurrentUser } from "../../../services/authService.js";

/**
 * Custom hook to fetch and manage current user data
 */
export function useUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setCurrentUser(userData);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Could not fetch user information.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  return {
    currentUser,
    loading,
    error
  };
}