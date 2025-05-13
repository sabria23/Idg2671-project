import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/createStudy.module.css';
import StudyDetails from './components/StudyDetails';
import ArtifactsUploader from './components/ArtifactsUploader';
import QuestionBuilder from './components/QuestionBuilder';
import QuestionList from './components/QuestionList';

const CreateStudyPage = () => {
    const navigate = useNavigate();
    const [studyTitle, setStudyTitle] = useState('');
    const [studyDescription, setStudyDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [studyId, setStudyId] = useState(null);
    const [questions, setQuestions] = useState([
        {
            questionTitle: 'Question1',
            questionText: '',
            questionType: 'multiple-choice',
            options: [
              { value: 'Option 1', label: 'Option 1' },
              { value: 'Option 2', label: 'Option 2' }
            ],
            layout: 'row',
            isRequired: false,
            fileContent: []
        }
    ]);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                questionTitle: `Question ${prev.length + 1}`,
                questionText: '',
                questionType: 'multiple-choice',
                fileContent: [],
                options: [
                  { value: 'Option 1', label: 'Option 1' },
                  { text: 'Option 2', label: 'Option 2' }
                ],
                layout: 'row',
                isRequired: false
            },
        ]);
    };

    // SAVE STUDY "CONTROLLERS"
    const handleSave = async () => {
        const formData = new FormData();
        formData.append('title', studyTitle);
        formData.append('description', studyDescription);
        selectedFiles.forEach((file) => formData.append('files', file));
        formData.append('questions', JSON.stringify(questions));

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/studies', formData, {
              headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            });
            alert('Study successfully created!');
            setStudyId(response.data.id); 
            navigate(`/dashboard`, { state: { newStudyId: response.data.id }});
        } catch (err) {
            console.error(err);
            alert('Error creating study');
        }
    };

   

    // RENDERING THE HTML CONTENT OF THE CREATE STUDY PAGE
    return (
        <div className={styles['studyPage-container']}>

            <main className={styles['studyPage-content']}>
                <h1>Create a new study</h1>
                <p>Fill out the details below and save to see the created study on dashboard</p>

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
                    questions={questions}
                    setQuestions={setQuestions}
                    selectedQuestionIndex={selectedQuestionIndex}
                    studyId={studyId}
                />

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={styles['studyPage-flexContent']}>
                        {/* LIST OF ADDED QUESTIONS */}
                        <div className={styles['studyPage-left']}>
                            <QuestionList 
                                    className={styles['questionBuilder-list']}
                                    questions={questions}
                                    selectedQuestionIndex={selectedQuestionIndex}
                                    setSelectedQuestionIndex={setSelectedQuestionIndex}
                                    addQuestion={addQuestion}
                                />
                        </div>

                        <div className={styles['studyPage-right']}>
                            

                            {/* QUESTION BUILDER */}
                            <QuestionBuilder
                                questions={questions}
                                setQuestions={setQuestions}
                                selectedFiles={selectedFiles}
                                selectedQuestionIndex={selectedQuestionIndex}
                                setSelectedQuestionIndex={setSelectedQuestionIndex}
                            />
                        </div>
                    </div>

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
                            <Link to={`/study/${studyId}/preview`}>Preview Study</Link>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CreateStudyPage;
