import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';
import QuestionEditor from './QuestionEditor';
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
            {/* Edit Question Text */}
            <QuestionEditor 
                questions={questions}
                setQuestions={setQuestions}
                selectedQuestionIndex={selectedQuestionIndex}
            />
        </>
    );
};

export default QuestionBuilder;