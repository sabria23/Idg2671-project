import React from 'react'
import styles from '../../../styles/Recruitment.module.css';
import {MdEmail} from "react-icons/md";


const EmailInvitation = ({ onProceed }) => {
  return (
    <div className={styles.recruitmentOption}>
    <div className={styles.optionIcon}>
      <span className={styles.iconEmoji}>
        <MdEmail size={24} />
      </span>
    </div>
    <div className={styles.optionDetails}>
      <h2 className={styles.optionTitle}>
            Recruit on your own
        <span className={styles.infoTooltip}>
          ⓘ
          <span className={styles.tooltipText}>
          Send email invitations directly to potential participants
          </span>
        </span>
      </h2>
      <p>Find participants manually by adding emails to invite them to your study.</p>
      <button 
        className={styles.optionButton}
        onClick={onProceed}
      >
        <MdEmail className={styles.buttonIcon}/> Add Emails
      </button>
    </div>
  </div>
);
   
}

export default EmailInvitation