import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';

const QuestionSettings = ({ questions, setQuestions, selectedQuestionIndex, setSelectedQuestionIndex, selectedFiles, setSelectedFiles }) => {
    
    if(selectedQuestionIndex === null || !questions[selectedQuestionIndex]){
        return <div className={styles['rightSide-panel']}></div>
    }

    const handleQuestionTitleChange = (index, value) =>{
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionTitle = value;
        setQuestions(updatedQuestions);
    };

    const handleQuestionTypeChange = (index, type) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] ={
            ...updatedQuestions[index],
            questionType: type,
        };
        setQuestions(updatedQuestions);
    };

    const handleRatingTypeChange = (index, ratingType) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            ratingType: ratingType,
        };
        setQuestions(updatedQuestions);
    };

     const handleRemoveArtifact = (indexToRemove) => {
            setSelectedFiles(prevFiles =>
                prevFiles.filter((_, index) => index !== indexToRemove)
            );
        };


    return(
        <div className={styles['rightSide-panel']}>
            <h3>Question Settings</h3>

            {/* Question Text */}
            <label>
                Question Title
                <input
                    className={styles['question-title']}
                    type="text"
                    value={
                        questions[selectedQuestionIndex].questionTitle
                    }
                    onChange={(e) =>
                        handleQuestionTitleChange(
                            selectedQuestionIndex,
                            e.target.value
                        )
                    }
                />
            </label>

            <label>
                Question Type
                <div>
                    <select
                        name={`questionType-${selectedQuestionIndex}`}
                        value={questions[selectedQuestionIndex].questionType}
                        onChange={(e) =>
                            handleQuestionTypeChange(
                                selectedQuestionIndex,
                                e.target.value
                            )
                        }
                    >
                        <option value='multiple-choice'>Multiple Choice</option>
                        <option value='open-ended'>Open Ended</option>
                    </select>
                </div>
            </label>

            {/* Multiple choice options */}
            {questions[selectedQuestionIndex].questionType ===
                'multiple-choice' && (
                <>
                    <label>
                        Multiple Choice Option
                    {questions[selectedQuestionIndex].options.map(
                        (option, optIndex) => (
                            <div key={optIndex}>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                        const updatedQuestions = [
                                            ...questions,
                                        ];
                                        updatedQuestions[
                                            selectedQuestionIndex
                                        ].options[optIndex] =
                                            e.target.value;
                                        setQuestions(updatedQuestions);
                                    }}
                                />
                            </div>

                        )
                    )}
                    </label>
                </>
            )}

            {/* Layout Template */}
            <label>
                Layout Template
                <select
                    value={
                        questions[selectedQuestionIndex].layout ||
                        'row'
                    }
                    onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[selectedQuestionIndex].layout =
                            e.target.value;
                        setQuestions(updatedQuestions);
                    }}
                >
                    <option value="row">Row Layout</option>
                    <option value="grid">Grid Layout</option>
                </select>
            </label>

            {/* Ratings */}
            <div>
                <label>
                    Ratings
                    <select 
                        value={questions[selectedQuestionIndex].ratingType || 'numeric-rating'}
                        onChange={(e) =>
                            handleRatingTypeChange(
                                selectedQuestionIndex,
                                e.target.value
                            )
                        }
                    >
                        <option value='numeric-rating'>Numeric Rating</option>
                        <option value='thumbs-up-down'>Thumbs Up/Down Rating</option>
                        <option value='star-rating'>Star Rating</option>
                        <option value='emoji-rating'>Emoji Rating</option>
                        <option value='label-slider'>Label Slider Rating</option>
                    </select>
                </label>
            </div>

            {/* Uploaded files display */}
            <div className={styles['uploadedFiles']}>
                <h3>Uploaded artifacts</h3>
                {selectedFiles.length === 0 ? (
                    <p>No artifacts uploaded yet</p>
                ) :(
                    
                    <ul className={styles['uploadedFiles-list']}>
                    {selectedFiles.map((file, index) => {
                        const fileURL = URL.createObjectURL(file);
                        const fType = file.type.split('/')[0];

                        return (
                            <li
                                key={index}
                                className={styles['artifact-item']}
                            >
                                {fType === 'image' && (
                                    <img
                                        src={fileURL}
                                        alt={file.name}
                                        width="150"
                                    />
                                )}
                                {fType === 'video' && (
                                    <video width="250" controls>
                                        <source
                                            src={fileURL}
                                            type={file.type}
                                        />
                                        Your browser does not support
                                        video playback
                                    </video>
                                )}
                                {fType === 'audio' && (
                                    <audio controls>
                                        <source
                                            src={fileURL}
                                            type={file.type}
                                        />
                                        Your browser does not support audio
                                        playback
                                    </audio>
                                )}
                                {(fType === 'text' ||
                                    fType === 'application') && (
                                    <p>
                                        <strong>{file.name}</strong>
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className={
                                        styles['removeArtifactBtn']
                                    }
                                    onClick={() =>
                                        handleRemoveArtifact(index)
                                    }
                                >
                                    Delete
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
            </div>

            {/* Delete question */}
            <button
            className={styles['delete-questionBtn']}
                type="button"
                onClick={() => {
                    const updatedQuestions = [...questions];
                    updatedQuestions.splice(selectedQuestionIndex, 1);
                    setQuestions(updatedQuestions);
                    setSelectedQuestionIndex(null);
                }}
            >
                Delete
            </button>
        </div>
    );
};

export default QuestionSettings;