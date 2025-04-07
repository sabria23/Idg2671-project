import React from 'react';
import styles from '../../../styles/createStudy.module.css';

const QuestionSettings = ({ questions, selectedQuestionIndex, setQuestions, setSelectedQuestionIndex, selectedFiles }) => {
    
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


    return(
        <div className={styles['rightSide-panel']}>
            <h3>Question Settings</h3>

            {/* Question Text */}
            <label>
                Question Title
                <input
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

            {/* Uploaded files display */}
            <div className={styles['uploadedFiles']}>
                <h3>Uploaded artifacts</h3>
                {selectedFiles.length === 0 ? (
                    <p>No artifacts uploaded yet</p>
                ) :(
                    <p>{selectedFiles.length} artifacts available</p>
                )}
            </div>

            <label>
                            Question Type
                            <div>
                                <input
                                    type="radio"
                                    name={`questionType-${selectedQuestionIndex}`}
                                    value="multiple-choice"
                                    checked={
                                        questions[selectedQuestionIndex]
                                            .questionType === 'multiple-choice'
                                    }
                                    onChange={(e) =>
                                        handleQuestionTypeChange(
                                            selectedQuestionIndex,
                                            e.target.value
                                        )
                                    }
                                />
                                Multiple Choice
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name={`questionType-${selectedQuestionIndex}`}
                                    value="open-ended"
                                    checked={
                                        questions[selectedQuestionIndex]
                                            .questionType === 'open-ended'
                                    }
                                    onChange={(e) =>
                                        handleQuestionTypeChange(
                                            selectedQuestionIndex,
                                            e.target.value
                                        )
                                    }
                                />
                                Open Ended
                            </div>
                        </label>

                        {/* Multiple choice options */}
                        {questions[selectedQuestionIndex].questionType ===
                            'multiple-choice' && (
                            <>
                                <h4>Multiple Choice Options</h4>
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