import React, {useState, useEffect} from 'react';
import { FaLink, FaInfoCircle, FaCheck, FaExclamationTriangle} from 'react-icons/fa'; //
import styles from '../../../styles/Recruitment.module.css';
import studyService from '../../../services/studyService';

const TogglePublish = ({ studyId, onStatusChange }) => {
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

useEffect(() => {
  const checkStudyStatus = async () => {
    try {
      if (!studyId) return;

      const study = await studyService.getStudyById(studyId);
      setIsPublished(study.published)
    } catch (error) {
      console.error("error fetching study status:", error);
      setError("Could not check if study is published");
    }
  };

    checkStudyStatus();
}, [studyId]);

const togglePublishStatus = async () => {
  setIsLoading(true);
  setError(null);
  setMessage(null);

  try {
    // Toggle to opposite of current status
    const newStatus = !isPublished;
    
    // Call the API to update status
    const response = await studyService.updateStudyPublicStatus(studyId, newStatus);
    
    // Update local state
    setIsPublished(newStatus);
    setMessage(response.message);
    
    // Notify parent component if needed
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  } catch (err) {
    console.error("Error toggling publish status:", err);
    setError("Failed to update study status. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className={styles.studyStatusContainer}>
  <div className={styles.studyStatusHeader}>
    <h3>Study Status</h3>
    <span className={`${styles.statusBadge} ${isPublished ? styles.statusPublished : styles.statusDraft}`}>
      {isPublished ? 'Published' : 'Draft'}
    </span>
  </div>
  
  <div className={styles.studyStatusContent}>
    <div className={`${styles.statusMessage} ${isPublished ? styles.publishedMessage : styles.draftMessage}`}>
      <div className={styles.statusIcon}>
        {isPublished ? <FaCheck className={styles.checkIcon} /> : <span className={styles.infoIcon}></span>}
      </div>
      <div className={styles.statusText}>
        <p className={styles.statusMainText}>
          {isPublished 
            ? 'Your study is published and can be shared with participants.' 
            : 'Your study is in draft mode and cannot be accessed by participants.'}
        </p>
        <p className={styles.statusSubText}>
          {isPublished 
            ? 'Study is now available. Get URL link to share with others!' 
            : 'Study has been unpublished and is no longer available to participants.'}
        </p>
      </div>
    </div>
    
    {error && <div className={styles.errorMessage}>{error}</div>}
  </div>
  
  <button 
    className={`${styles.actionButton} ${isPublished ? styles.unpublishButton : styles.publishButton}`}
    onClick={togglePublishStatus}
    disabled={isLoading}
  >
    {isLoading
      ? 'Updating...'
      : isPublished
        ? 'Unpublish Study'
        : 'Publish Study'}
  </button>
</div>
);
};
  /*return (
    <div className={styles.recruitmentOption}>
      <div className={styles.optionIcon}>
        <span className={styles.iconEmoji}>🔗</span>
      </div>
      <div className={styles.optionDetails}>
        <h2 className={styles.optionTitle}>
          Recruit easily with StudyPlatform
          <span className={styles.infoTooltip}>
            ⓘ
            <span className={styles.tooltipText}>
              Share a link through social media, messaging apps or email
            </span>
          </span>
        </h2>
        <p>Use a link to invite users via any channel you like.</p>
        <button 
          className={styles.optionButton}
          onClick={onProceed}
        >
          <span className={styles.buttonIcon}>🔗</span> Set up link
        </button>
      </div>
    </div>
  );
};*/

export default TogglePublish;


