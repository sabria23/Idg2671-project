import React, { useState } from 'react';
//import NavBar from '../../Components/NavBar.jsx';
import axios from 'axios';
import styles from './CreateStudyPage.module.css';



const CreateStudyPage = () => {
    const [studyTitle, setStudyTitle] = useState('');
    const [studyDescription, setStudyDescription] = useState('');
    const [questions, setQuestions] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [questionType, setQuestionType] = useState('multiple-choice');

    // Handling the uploading of artifacts
    const acceptedArtifactTypes = {
        image: '.jpg, .jpeg, .png, .gif',
        video: '.mp4, .avi, .mov, .wmv',
        audio: '.mp3, .mav, .wav',
        text: '.txt, .pdf, .doc, .docx'
    };

    const handleArtifactTypeChange = (e) => {
        setFileType(e.target.value);
        setFiles([]);
        setUploadStatus('');
    }

    const handleArtifactChange = (e) =>{
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setUploadStatus('');
    };

    const uploadArtifacts = async () =>{
        if(files.length === 0){
            setUploadStatus('Please select a file to upload');
            return;
        }
    }

    setUploadStatus('Uploading...');

    // Handle input for study title and description
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name === 'title'){
            setStudyTitle(value);
        } else if(name === 'description'){
            setStudyDescription(value);
        }
    };

    // Handle study uploading
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                questionType: 'questionType',
                fileContent: null,
                options: [],
            },
        ]);
    };


    // Handle question text change
    const handleQuestionTextChange = (index, value) =>{
        const updatedQuestions = [...questions];
        updatedQuestions[index].text = value;
        setQuestions(updatedQuestions);
    };

    // Handle saving the form data(study, questions, files)
    const handleSave = async() =>{
        const formData = new FormData();
        formData.append('title', studyTitle);
        formData.append('description', studyDescription);

        for(let i = 0; i < selectedFiles.length; i++){
            formData.append('files', selectedFiles[i]);
        }

        formData.append('questions', JSON.stringify(questions));

        try{
            await axios.post('/api/studies', formData);
            alert('Study successfully created!');
        } catch (err){
            console.error(err);
            alert('Error creating study');
        }
    };

return (
        <div className={styles['studyPage-container']}>
            <nav className={styles['navbar']}>
                <div className={styles['logo']}></div>
                <div className={styles['navLinks']}>
                    <button>Back to dashboard</button>
                    <button>Logout</button>
                </div>
            </nav>

            <main className={styles['studyPage-content']}>
                <div className={styles['studyPage-header']}>
                    <h1>Create a new study</h1>
                    <p>Fill out the details below and save to see the created study on dashboard</p>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={}>
                        <label>Study Title:</label>
                            <input 
                                className={styles['studyTitle-input']}
                                type='text'
                                name='title'
                                value={studyTitle}
                                onChange={handleInputChange}
                            />
                    
                        <label>Study Description:</label>
                            <textarea
                                className={styles['studyDescription-input']}
                                name='description' 
                                value={studyDescription}
                                onChange={handleInputChange}
                            />
                    </div>
                    
                    <div className={styles['uploadArtifact-container']}>
                        <label>Upload Artifact:</label>
                            <select
                                className={styles[]}
                                value={fileType}
                                onChange={handleArtifactTypeChange}
                                disabled={uploading}
                            >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                                <option value="text">Text</option>
                            </select>
                            <input 
                                className={styles[]}
                                type='file'
                                multiple
                                onChange={handleArtifactChange}
                                accept={acceptedArtifactTypes[fileType]}
                                disabled={uploading}
                            />

                            {uploadStatus && (
                                <p className={styles[]}>{uploadStatus}</p>
                            )}
                        <button>
                            className={styles[]}
                            onClick={uploadArtifacts}
                            disabled={uploading || files.length === 0}
                        </button>
                    </div>
                    <div className={styles[]}>
                        <button onClick={addQuestion}>Add Question</button>
                        {questions.map((question, index) => (
                            <div key={index}>
                                <input 
                                    type='text'
                                    placeholder='Enter question text'
                                    value={question.text}
                                    onChange={(e) =>
                                        handleQuestionTextChange(index, e.target.value)
                                    } 
                                />
                                <select
                                    onChange={(e) =>
                                        setQuestionType(e.target.value)
                                    }
                                    value={questionType}
                                >
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="open-ended">Open Ended</option>
                                </select>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSave}>Save Study</button>
                    <Link to='/survey/${studyId}/preview'></Link>
                </form>
            </main>
        </div>
    )  
}
export default CreateStudyPage;