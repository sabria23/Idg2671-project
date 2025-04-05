import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../styles/createStudy.module.css';

const CreateStudyPage = () => {
    const [studyTitle, setStudyTitle] = useState('');
    const [studyDescription, setStudyDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileType, setFileType] = useState('image');
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploading, setUploading] = useState(false);
    const [questionType, setQuestionType] = useState('multiple-choice');
    const [studyId, setStudyId] = useState(null);

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
    };

    const handleArtifactChange = (e) => {
        const selected = Array.from(e.target.files);
        setFiles(selected);
        setUploadStatus('');
    };

    const uploadArtifacts = async () => {
        if (files.length === 0) {
            setUploadStatus('Please select a file to upload');
            return;
        }

        setUploading(true);
        setUploadStatus('Uploading...');

        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('artifacts', file));

            // Replace with correct API endpoint if different
            await axios.post('/api/artifacts', formData);

            setUploadStatus('Upload successful!');
            setSelectedFiles([...selectedFiles, ...files]);
            setFiles([]);
        } catch (error) {
            console.error(error);
            setUploadStatus('Error uploading artifacts.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveArtifact = (indexToRemove) =>{
        setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') {
            setStudyTitle(value);
        } else if (name === 'description') {
            setStudyDescription(value);
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: '',
                questionType: questionType,
                fileContent: null,
                options: [],
            },
        ]);
    };

    const handleQuestionTextChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = value;
        setQuestions(updatedQuestions);
    };

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

    return (
        <div className={styles['studyPage-container']}>
            <nav className={styles['navbar']}>
                <div className={styles['logo']}>StudyPlatform</div>
                <div className={styles['navLinks']}>
                    <button>Back to dashboard</button>
                    <button>Logout</button>
                </div>
            </nav>

            <main className={styles['studyPage-content']}>
                <h1>Create a new study</h1>
                <p>Fill out the details below and save to see the created study on dashboard</p>

                {/* STUDY DETAILS*/}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={styles['studyDetails-container']}>
                        <label>Study Title:</label>
                        <input
                            type='text'
                            name='title'
                            value={studyTitle}
                            onChange={handleInputChange}
                        />

                        <label>Study Description:</label>
                        <textarea
                            className={styles['studyDescription-textInput']}
                            name='description'
                            value={studyDescription}
                            onChange={handleInputChange}
                        />
                    </div>

                {/* ARTIFACTS*/}
                    <div className={styles['uploadArtifact-container']}>
                        <h2>Artifacts (Video, Image, Text, Audio)</h2>
                        <label>Upload Artifact:</label>
                        <select
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
                            type='file'
                            multiple
                            onChange={handleArtifactChange}
                            accept={acceptedArtifactTypes[fileType]}
                            disabled={uploading}
                        />

                        <button
                            className={styles['artifactBtn']}
                            type="button"
                            onClick={uploadArtifacts}
                            disabled={uploading || files.length === 0}
                        >
                            + Add
                        </button>

                        {uploadStatus && (
                            <p className={styles['upload-status']}>{uploadStatus}</p>
                        )}
                    </div>

                    {/* DISPLAY UPLOADED FILES*/}
                    <div className={styles['uploadedFiles']}>
                        <h3>Uploaded artifacts</h3>
                        {selectedFiles.length > 0 ? (
                            <p>No artifacts uploaded yet</p>
                        ) : (
                            <ul className={styles['uploadedFiles-list']}>
                                {selectedFiles.map((file, index) => {
                                    const fileURL = URL.createObjectURL(file);
                                    const fileType = file.type.split('/')[0];

                                    return (
                                        <li key={index} className={styles['artifact-item']}>
                                            {fileType === 'image' && (
                                                <img src={fileURL} alt={file.name} width='150'/>
                                            )}
                                            {fileType === 'video' && (
                                                <video width='250' controls>
                                                    <source src={fileURL} type={file.type} />
                                                    Your browser does not support audio playback
                                                </video>
                                            )}
                                            {fileType === 'audio' && (
                                                <audio controls>
                                                    <source src={fileURL} type={file.type} />
                                                    Your browser does not support audio playback
                                                </audio>
                                            )}
                                            {fileType === 'text' || fileType === 'application' ? (
                                                <p>
                                                    <strong>{file.name}</strong>
                                                </p>
                                            ) : null}

                                            <button
                                                type='button'
                                                className={styles['removeArtifactBtn']}
                                                onClick={() => handleRemoveArtifact(index)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className={styles['questionBuilder-container']}>
                        <button type="button" onClick={addQuestion}>Add Question</button>
                        {questions.map((question, index) => (
                            <div key={index}>
                                <input
                                    type='text'
                                    placeholder='Enter question text'
                                    value={question.questionText}
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

                    <button
                        className={styles['saveStudyBtn']}
                        type="button"
                        onClick={handleSave}
                    >
                        Save Study
                    </button>

                    {studyId && (
                        <Link to={`/survey/${studyId}/preview`}>Preview Survey</Link>
                    )}
                </form>
            </main>
        </div>
    );
};

export default CreateStudyPage;
