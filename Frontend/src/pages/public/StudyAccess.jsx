import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/StudyAccess.module.css';

const StudyAccess = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStudy = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`https://group4-api.sustainability.it.ntnu.no/api/studies/public/${studyId}`);
        setStudy(response.data.data);
        setError(null);
        
      } catch (err) {
        console.error("Error accessing study:", err);
        
        // Handle different error types
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 403) {
            setError("This study is no longer available. It may have been unpublished.");
          } else if (err.response.status === 404) {
            setError("Study not found. The link may be incorrect.");
          } else {
            setError("Unable to access this study. Please try again later.");
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("Network error. Please check your connection and try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudy();
  }, [studyId]);
  
  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading study...</p>
        </div>
      </div>
    );
  }
  
  // Error state - this handles the "study is unpublished" case
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Study Unavailable</h2>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }
  
  // If everything is good, render the study content
  return (
    <div className={styles.container}>
      {study && (
        <div className={styles.studyContainer}>
          <h1 className={styles.studyTitle}>{study.title}</h1>
          <p className={styles.studyDescription}>{study.description}</p>
          
          {/* Study content, questions, etc. */}
          <button 
            className={styles.buttonPrimary}
            onClick={() => navigate(`/study/${studyId}/live`)} // Navigate to the participation page -> marius page
          >
            Begin Study
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyAccess;