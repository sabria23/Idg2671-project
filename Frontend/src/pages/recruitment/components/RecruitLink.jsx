import React from 'react';
import { FaLink, FaInfoCircle } from 'react-icons/fa'; //
import styles from '../../../styles/Recruitment.module.css';

const RecruitLink = ({ onProceed }) => {
  return (
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
};

export default RecruitLink;


