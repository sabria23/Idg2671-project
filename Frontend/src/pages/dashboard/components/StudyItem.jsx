import React from 'react';
import styles from "../../../styles/Dash.module.css";
import DropdownMenu from "../../../components/common/DropDownMenu";
import {Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getResponseCount } from '../../../utils/responseUtils';

const StudyItem = ({ study, onRename, onEdit, onDelete, onExport }) => {
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    const fetchResponseCount = async () => {
      const count = await getResponseCount(study._id);
      setResponseCount(count);
    };
    
    fetchResponseCount();
  }, [study._id]);

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
        <div className={styles.responseCount}>{responseCount} Responses</div>
        <div className={styles.responseStatus}>

        </div>
      </div>
      
      <div className={styles.studyActions}>
        <Link to={`/recruit/${study._id}`} className={styles.recruitButton}>
            Recruit
        </Link>
        
        <div className={styles.studyDate}>
          {new Date(study.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
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