import React from 'react';
import styles from '../../../styles/Recruitment.module.css';


const TogglePublish = ({ title, createdDate, published, onToggle }) => {
  const formattedDate = new Date(createdDate).toLocaleDateString();

  return (
    <>
 <div className={styles.card}>
 <div className={styles.cardContent}>
   <div className={styles.headerFlex}>
     <div>
       <h1 className={styles.title}>{title}</h1>
       <p className={styles.subtitle}>Created on {formattedDate}</p>
     </div>
     <div className={styles.statusContainer}>
       {published ? (
         <span className={`${styles.statusBadge} ${styles.statusPublished}`}>
           Published
         </span>
       ) : (
         <span className={`${styles.statusBadge} ${styles.statusDraft}`}>
           Draft
         </span>
       )}
       
       {published ? (
              <button 
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => onToggle(false)}
              >
                <span className={styles.btnIcon}></span>
                Unpublish
              </button>
            ) : (
              <button 
                className={`${styles.btn} ${styles.btnSuccess}`}
                onClick={() => onToggle(true)}
              >
                <span className={styles.btnIcon}></span>
                Publish
              </button>
            )}
     </div>
   </div>
 </div>
</div>
</>
  )
}
export default TogglePublish;


