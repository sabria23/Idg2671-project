import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
    const [savedStudyId, setSavedStudyId] = useState(null);
    const [questions, setQuestions] = useState([
        {
            questionText: 'Question 1',
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

    const { studyId } = useParams();
    const isEditMode = !!studyId;

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                questionText: `Question ${prev.length + 1}`,
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
          const url = isEditMode ? `/api/studies/${studyId}` : '/api/studies';
    
          const response = isEditMode
          ? await axios.patch(url, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
          }
        })
          : await axios.post(url, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
          }
        });
            alert(`Study successfully ${isEditMode ? 'updated' : 'created'}!`);
            setSavedStudyId(response.data._id || studyId); 
        } catch (err) {
            console.error(err);
            alert('Error creating study');
        }
    };

   useEffect(() =>{
    const fetchStudy = async () =>{
      if(!isEditMode) return;

      try{
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/studies/${studyId}`,{
          headers:{
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
        setStudyTitle(data.title);
        setStudyDescription(data.description);
        setQuestions(data.questions || []);
        setSavedStudyId(data._id);
      }catch (err){
        console.error('Got error fetching study:', err);
        alert('Could not fetch the study from the database');
      }
    };

    fetchStudy();
   }, [isEditMode, studyId]);

   const handlePreviewClick = () => {
    if(savedStudyId){
      navigate(`/api/study/${savedStudyId}/preview`);
    }
   };

    // RENDERING THE HTML CONTENT OF THE CREATE STUDY PAGE
    return (
        <div className={styles['studyPage-container']}>

            <main className={styles['studyPage-content']}>
                <h1>{isEditMode ? 'Edit Study' : 'Create a new study'}</h1>
                <p>{isEditMode 
                  ? 'Make changed to your study and save to update it'
                  : 'Fill out the details below and save to see the created study on dashboard'}
                </p>

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
                    savedStudyId={savedStudyId}
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
                  <div className={styles['btnGroup']}>
                    <button
                        className={styles['saveStudyBtn']}
                        type="button"
                        onClick={handleSave}
                    >
                      {isEditMode ? 'Update Study' : 'Save Study'}
                    </button>
                    <p className={styles['saveStudy-para']}>Click on the save button to save this study.</p>

                    {/* LINK/ BUTTON THE PREVIEW */}
                    <button
                      className={styles['previewBtn']} 
                      type='button'
                      onClick={handlePreviewClick}
                      disabled={!savedStudyId}
                    >
                      Preview Study
                    </button>     
                    <p className={styles['previewStudy-para']}>If you want to preview your saved study, click the preview button after saving</p>
                </div>
              </div>
            </main>
        </div>
    );
};

export default CreateStudyPage;
