import React from 'react';
import styles from "../../../styles/Recruitment.module.css";

const DemographSettings = ({ published }) => {
  return (
    <>
     <div className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.sectionTitle}>Demographics Collection</h2>
            
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxContainer}>
                <input
                  id="collect-age"
                  type="checkbox"
                  className={styles.checkboxInput}
                  //checked={recruitmentData.demographics.collectAge}
                  onChange={() => {/* toggle collectAge */}}
                />
                <label htmlFor="collect-age" className={styles.checkboxLabel}>Collect participant age</label>
              </div>
            </div>
            
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxContainer}>
                <input
                  id="collect-gender"
                  type="checkbox"
                  className={styles.checkboxInput}
                  //checked={recruitmentData.demographics.collectGender}
                  onChange={() => {/* toggle collectGender */}}
                />
                <label htmlFor="collect-gender" className={styles.checkboxLabel}>Collect participant gender</label>
              </div>
            </div>
            
            <div className={styles.buttonContainerRight}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={!published}
              >
                Save Demographics Settings
              </button>
            </div>
          </div>
        </div>
    </>
  )
}

export default DemographSettings