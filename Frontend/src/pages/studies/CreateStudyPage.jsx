import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/createStudy.module.css';
import Navbar from "../../components/common/Navbar";
import StudyDetails from './components/StudyDetails';
import ArtifactsUploader from './components/ArtifactsUploader';
import QuestionBuilder from './components/QuestionBuilder';

const CreateStudyPage = () => {
    const [studyTitle, setStudyTitle] = useState('');
    const [studyDescription, setStudyDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [studyId, setStudyId] = useState(null);
    const [questions, setQuestions] = useState([
        {
            questionTitle: 'Question1',
            questionText: '',
            questionType: 'multiple-choice',
            options: ['Option 1', 'Option 2'],
            layout: 'row'
        }
    ]);

    // SAVE STUDY "CONTROLLERS"
    const handleSave = async () => {
        const formData = new FormData();
        formData.append('title', studyTitle);
        formData.append('description', studyDescription);
        selectedFiles.forEach((file) => formData.append('files', file));
        formData.append('questions', JSON.stringify(questions));

        try {
            const response = await axios.post('/api/studies', formData);
            alert('Study successfully created!');
            setStudyId(response.data.id); // Assuming the study ID is returned in response
        } catch (err) {
            console.error(err);
            alert('Error creating study');
        }
    };

    // NAVIGATION ITEMS FOR THE CREATY STUDY PAGE - NAVBAR COMPONENT
    const createStudyNavItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Profile", path: "/profile" },
        { /*label: "Logout", action: handleLogout */} //implement this later    
      ];

    // RENDERING THE HTML CONTENT OF THE CREATE STUDY PAGE
    return (
        <div className={styles['studyPage-container']}>
            <Navbar 
                className={styles.fullWidthNav}
                title="StudyPlatform" 
                navItems={createStudyNavItems}
                //onLogout={handleLogout} // this needs to commented out because it is not working
            />

            <main className={styles['studyPage-content']}>
                <h1>Create a new study</h1>
                <p>Fill out the details below and save to see the created study on dashboard</p>

                <form onSubmit={(e) => e.preventDefault()}>

                    {/* STUDY DETAILS */}
                    <StudyDetails
                        studyTitle={studyTitle} 
                        studyDescription={studyDescription}
                        setStudyTitle={setStudyTitle}
                        setStudyDescription={setStudyDescription}
                    />
                    
                    {/* ARTIFACTS */}
                    <ArtifactsUploader
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                    />

                    {/* QUESTION BUILDER */}
                    <QuestionBuilder
                        questions={questions}
                        setQuestions={setQuestions}
                        selectedFiles={selectedFiles}
                    />

                </form>
                
                {/* SAVE STUDY BUTTON */}
                <div className={styles['saveBtns']}>
                    <button
                        className={styles['saveStudyBtn']}
                        type="button"
                        onClick={handleSave}
                    >
                        Save Study
                    </button>

                    {/* LINK/ BUTTON THE PREVIEW */}
                    <button className={styles['previewBtn']} type="button">
                            <Link to={`/survey/${studyId}/preview`}>Preview Survey</Link>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CreateStudyPage;
