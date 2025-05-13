import React from 'react';
import styles from "../../../styles/Recruitment.module.css"

const EmailInvitation = () => {
  return (
    <>
      <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.sectionTitle}>Invite Participants</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="emails" className={styles.formLabel}>
                Email Addresses
              </label>
              <textarea
                id="emails"
                rows="3"
                className={styles.formTextarea}
                placeholder="Enter email addresses (one per line or separated by commas)"
              ></textarea>
              <p className={styles.helperText}>
                Enter up to 50 email addresses at once
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.formLabel}>
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                className={styles.formInput}
                placeholder="Invitation to participate in our research study"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                Email Message
              </label>
              <textarea
                id="message"
                rows="6"
                className={styles.formTextarea}
                placeholder="Hello,
  
  We invite you to participate in our research study. Your input is valuable to our research.
  
  Please click the link below to begin the survey:
  
  [Survey Link will be automatically inserted here]
  
  Thank you,
  Research Team"
              ></textarea>
              <p className={styles.helperText}>
                The survey link will be automatically added to the email
              </p>
            </div>
            
            <div className={styles.buttonGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>
                Send Invitations
              </button>
            </div>
          </div>
        </div>
    </>
  )
}

export default EmailInvitation