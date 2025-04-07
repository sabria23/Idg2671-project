import React from 'react';
import styles from '../../../styles/createStudy.module.css';

const StudyDetails = ({ studyTitle, studyDescription, setStudyTitle, setStudyDescription }) =>{

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setStudyTitle(value);
        } else if (name === 'description') {
            setStudyDescription(value);
        }
    };


    return(
            <div className={styles['studyDetails-container']}>
                <label>Study Title:</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Short descriptive title"
                    value={studyTitle}
                    onChange={handleInputChange}
                />

                <label>Study Description:</label>
                <textarea
                    className={styles['studyDescription-textInput']}
                    name="description"
                    placeholder="Brief summary of the study"
                    value={studyDescription}
                    onChange={handleInputChange}
                />
            </div>
    );
};

export default StudyDetails;