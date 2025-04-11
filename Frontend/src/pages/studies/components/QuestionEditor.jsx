import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';
import NumericRating from './NumericRating';
import ThumbsUpDown from './ThumbsUpDown';
import StarRating from './StarRating';
import EmojiRating from './EmojiRating';
import LabelSlider from './LabelSlider';

const QuestionEditor = ({ questions, selectedQuestionIndex, setQuestions }) =>{
    if(selectedQuestionIndex === null || !questions[selectedQuestionIndex]){
        return <div>
            <p>Select a question to edit</p>
        </div>;
    }
    
    const currentQuestion = questions[selectedQuestionIndex];

    const handleQuestionTextChange = (e) => {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestionIndex].questionText = e.target.value;
        setQuestions(updatedQuestions);
    };

    const renderRatingComponent = () => {
        const ratingType = currentQuestion.ratingType || 'numeric-rating';

        switch(ratingType){
            case 'numeric-rating':
                return <NumericRating />;
            case 'thumbs-up-down':
                return <ThumbsUpDown />;
            case 'star-rating':
                return <StarRating />;
            case 'emoji-rating':
                return <EmojiRating />;
            case 'label-slider':
                return <LabelSlider />;
            default:
                return <NumericRating />;
        }
    };

    return(
        <div className={styles['middle-panel']}>
            <h3>Edit Question</h3>
            {currentQuestion.questionType === 'open-ended' && (
                <div>
                    <label>
                        Question Text
                        <textarea
                            value={currentQuestion.questionText || ''}
                            onChange={handleQuestionTextChange}
                            placeholder='Enter your question here...'
                        />
                    </label>
                </div>
            )}


            <div>
                <h4>Rating Preview</h4>
                {renderRatingComponent()}
            </div>
        </div>

    );
};

export default QuestionEditor;