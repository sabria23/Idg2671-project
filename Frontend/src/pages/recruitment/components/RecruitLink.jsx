import React from 'react';
import styles from '../../../styles/Recruitment.module.css';

const RecruitLink = () => {
  return (
    <div className={styles.recruitmentOption}>
            {/*<div className={styles.iconContainer}>
                
            </div>*/}
            <div className={styles.optionDetails}>
                <h2>Recruit easily with StudyPlatform</h2>
                <p>Use a link to invite users via any channel you like.</p>
                <button className={styles.setUpLinkBtn}>Set up link</button>
            </div>
        </div>
  )
}

export default RecruitLink;