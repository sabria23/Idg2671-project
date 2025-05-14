import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../../../styles/Recruitment.module.css"

const ShareableLink = ({ studyId, published }) => {
  const [shareableUrl, setShareableUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

   // Fetch the shareable link when the component mounts or when published status changes
   useEffect(() => {
    // Only fetch the link if the study is published
    if (published) {
      fetchShareableLink();
    } else {
      // Clear the link if the study is unpublished
      setShareableUrl('');
    }
  }, [studyId, published]);
  
  const fetchShareableLink = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the token from wherever you're storing it
      const token = localStorage.getItem('token'); // i  need to get token in order to authorized the loged in user, if not they will have access to access the link
      
      if (!token) {
        setError('You need to be logged in to access this feature');
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get(
        `http://localhost:8000/api/studies/${studyId}/link`, 
        config
      );
      
      setShareableUrl(response.data.studyUrl || response.data.data.shareableUrl);
    } catch (err) {
      console.error('Error fetching shareable link:', err);
      setError('Failed to generate link. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 // If study is not published, don't show anything
 if (!published) {
  return null;
}

const handleCopy = async () => {
  try {
    //https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    await navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setShowTooltip(true);

    setTimeout(() => {
      setCopied(false);
      setShowTooltip(false);
    }, 3000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
};
return (
  <>
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h2 className={styles.sectionTitle}>Shareable Survey Link</h2>
        {loading ? (
          <div className={styles.loadingIndicator}>Generating link...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <div className={styles.linkSection}>
            <div className={styles.linkHeader}>
              <span className={styles.linkLabel}>Public Link</span>
              <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                Active
              </span>
            </div>
            <p className={styles.helperText}>
              Participants can only take this survey once. Link will become inactive if study is unpublished.
            </p>
            {/* Display the actual link */}
            {shareableUrl && (
              <div className={styles.linkContainer}>
                <input 
                  type="text" 
                  readOnly 
                  value={shareableUrl} 
                  className={styles.linkInput}
                />
                <div className={styles.tooltipContainer}>
                  <button
                    className={`${styles.copyButton} ${copied ? styles.copiedButton : ''}`}
                    onClick={handleCopy}
                  >
                    Copy
                  </button>
                  {showTooltip && (
                    <div className={styles.tooltip}>
                      Link is copied
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </>
);
};
export default ShareableLink