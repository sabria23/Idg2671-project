import React from 'react';
import styles from "../../../styles/Dash.module.css";
import DropdownMenu from "../../../components/common/DropDownMenu";
import {Link} from 'react-router-dom';


const StudyItem = ({ study, onRename, onEdit, onDelete, onExport }) => {

  // to see whether the study is published o rnot - its status
  const isPublished = study.published;
    
  return (
    <div className={styles.studyItem}>
      <div className={styles.studyType}>
        <span className={`${styles.statusIndicator} ${isPublished ? styles.published : styles.draft}`}>
          {isPublished ? 'Published' : "Draft"}
        </span>
      </div>
      
      <div className={styles.studyInfo}>
        <div className={styles.studyName}>{study.title}</div>
      </div>
      
      <div className={styles.responseInfo}>
        <div className={styles.responseCount}>0 Responses</div>
        <div className={styles.responseStatus}>

        </div>
      </div>
      
      <div className={styles.studyActions}>
        <Link to="/recruit" className={styles.recruitButton}>
            Recruit
        </Link>
        
        <div className={styles.studyDate}>
          {new Date(study.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </div>
        <div className={styles.userIndicator}>
          {study.creator && study.creator.username 
            ? study.creator.username[0].toUpperCase() 
            : 'U'}
        </div>
        
        <DropdownMenu
          options={[
            { label: 'Rename', action: () => onRename(study._id) },
            { label: 'Edit', action: () => onEdit(study._id) },
            { label: 'Export', action: () => onExport(study._id)  },
            { label: 'Delete', action: () => onDelete(study._id), isDanger: true }
          ]}
        />
      </div>
    </div>
  );
};

export default StudyItem;