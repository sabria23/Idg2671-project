import React, {useState} from 'react';
import styles from '../../../styles/createStudy.module.css';
import QuestionList from './QuestionList';
import QuestionEditor from './QuestionEditor';
import QuestionSettings from './QuestionBuilder';

const QuestionBuilder = ({ questions, setQuestions, selectedFiles }) =>{

    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                questionTitle: `Question ${prev.length + 1}`,
                questionText: '',
                questionType: 'multiple-choice',
                fileContent: null,
                options: [],
                layout: 'row'
            },
        ]);
    };

    return(
        <div className={styles['questionBuilder-container']}>
            {/* Left side panel: List of questions */}
            <QuestionList 
                questions={questions}
                selectedQuestionIndex={selectedQuestionIndex}
                setSelectedQuestionIndex={setSelectedQuestionIndex}
                addQuestion={addQuestion}
            />

            {/* Middle panel: Edit Question Text */}
            <QuestionEditor 
                questions={questions}
                selectedQuestionIndex={selectedQuestionIndex}
                setQuestions={setQuestions}
            />

            {/* Right side panel: Question Settings */}
            <QuestionSettings 
                questions={questions}
                selectedQuestionIndex={selectedQuestionIndex}
                setQuestions={setQuestions}
                setSelectedQuestionIndex={setSelectedQuestionIndex}
                selectedFiles={selectedFiles}
            />
        </div>

    );
};

export default QuestionBuilder;