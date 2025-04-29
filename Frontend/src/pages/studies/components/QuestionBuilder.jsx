import React from 'react';
//import styles from '../styles/QuestionBuilder.module.css';
import QuestionSettings from './SettingsForQuestions';

const QuestionBuilder = ({ questions, setQuestions, selectedFiles, selectedQuestionIndex, setSelectedQuestionIndex }) =>{


    return(
        <>
            {/* Question Settings */}
            <QuestionSettings 
                questions={questions}
                setQuestions={setQuestions}
                selectedFiles={selectedFiles}
                selectedQuestionIndex={selectedQuestionIndex}
                setSelectedQuestionIndex={setSelectedQuestionIndex}
            />
        </>
    );
};

export default QuestionBuilder;