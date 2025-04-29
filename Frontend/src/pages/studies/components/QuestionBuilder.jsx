import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';
import QuestionEditor from './QuestionEditor';
import QuestionSettings from './SettingsForQuestions';

const QuestionBuilder = ({ questions, setQuestions, selectedFiles, selectedQuestionIndex, setSelectedQuestionIndex }) =>{


    return(
        <div className={styles['questionBuilder-container']}>

            {/* Middle panel: Edit Question Text */}
            <QuestionEditor 
                questions={questions}
                setQuestions={setQuestions}
                selectedQuestionIndex={selectedQuestionIndex}
            />

            {/* Right side panel: Question Settings */}
            <QuestionSettings 
                questions={questions}
                setQuestions={setQuestions}
                selectedFiles={selectedFiles}
                selectedQuestionIndex={selectedQuestionIndex}
                setSelectedQuestionIndex={setSelectedQuestionIndex}
            />
        </div>

    );
};

export default QuestionBuilder;