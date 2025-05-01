import React from 'react';
import styles from '../styles/StudyDetails.module.css';

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
                <h2>Study Title:</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Short descriptive title"
                    value={studyTitle}
                    onChange={handleInputChange}
                />

                <h2>Study Description:</h2>
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