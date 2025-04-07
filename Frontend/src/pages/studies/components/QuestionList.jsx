import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';

const QuestionList = ({ questions, selectedQuestionIndex, setSelectedQuestionIndex, addQuestion }) => {

    return(
        <div className={styles['addQuestion']}>
            <h3>Questions</h3>
            <ul>
                {questions.map((question, index) => (
                    <li
                        key={index}
                        onClick={() => setSelectedQuestionIndex(index)}
                        className={
                            selectedQuestionIndex === index
                                ? styles.selectedQuestion
                                : ''
                        }
                    >
                        {question.questionTitle || `Question ${index + 1}`}
                    </li>
                ))}
            </ul>

            <button type="button" onClick={addQuestion}>
                + Add Question
            </button>
        </div>
    );

};

export default QuestionList;

