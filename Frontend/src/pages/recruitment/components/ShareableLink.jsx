import React from 'react';
import styles from "../../../styles/Recruitment.module.css"

const ShareableLink = () => {
  return (
    <>
    <div className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.sectionTitle}>Shareable Survey Link</h2>
              
              <div className={styles.linkSection}>
                <div className={styles.linkHeader}>
                  <span className={styles.linkLabel}>Public Link</span>
                  <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                    Active
                  </span>
                </div>
                <div className={styles.linkContainer}>
                  <input
                    type="text"
                    readOnly
                    className={styles.linkInput}
                    value={`${window.location.origin}/study/${study._id}`}
                  />
                  <button className={styles.iconButton}>
                    <span className={styles.icon}>{/* copy icon */}</span>
                  </button>
                  <button className={styles.iconButton}>
                    <span className={styles.icon}>{/* qr code icon */}</span>
                  </button>
                </div>
                <p className={styles.helperText}>
                  Participants can only take this survey once. Link will become inactive if study is unpublished.
                </p>
              </div>
            </div>
          </div>
    </>
  )
}

export default ShareableLink