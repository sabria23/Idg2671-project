import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';

const QuestionEditor = ({ questions, selectedQuestionIndex, setQuestions }) =>{

    const handleQuestionTextChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = value;
        setQuestions(updatedQuestions);
    };

    return(
        <div className={styles['middle-panel']}>
            {selectedQuestionIndex !== null && questions[selectedQuestionIndex] && (
                <>
                    {questions[selectedQuestionIndex].questionType === 'open-ended' ? (
                        <>
                            <h3>Edit Question</h3>
                            <textarea 
                                placeholder='Enter your question text here'
                                value={questions[selectedQuestionIndex].questionText}
                                onChange={(e) =>
                                    handleQuestionTextChange(selectedQuestionIndex, e.target.value)
                                }
                                rows={4}
                                cols={40}  
                            />
                        </>
                    ) : (
                        <p>Select a question type on the right</p>
                    )}
                </>
            )}
        </div>
    );
};

export default QuestionEditor;