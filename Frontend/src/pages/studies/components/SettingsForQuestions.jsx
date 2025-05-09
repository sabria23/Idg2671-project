import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';
import NumericRating from './NumericRating';
import ThumbsUpDown from './ThumbsUpDown';
import StarRating from './StarRating';
import EmojiRating from './EmojiRating';
import LabelSlider from './LabelSlider';

const QuestionSettings = ({ questions, setQuestions, selectedQuestionIndex, setSelectedQuestionIndex}) => {
    
    if(selectedQuestionIndex === null || !questions[selectedQuestionIndex]){
        return <div className={styles['rightSide-panel']}></div>
    }

    const currentQuestion = questions[selectedQuestionIndex];

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
        <div className={styles['question-settings']}>
            <h3>Question Settings</h3>

            {/* Question Text */}
            <div className={styles['question-text']}>
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
            </div>

            <div className={styles['question-type']}>
                <label>
                    Question Type
                    <div className={styles['question-type-grid']}>
                        <div
                            className={`${styles['type-option']} 
                                        ${questions[selectedQuestionIndex].questionType === 'multiple-choice' ? styles['selected'] : ''}`}
                            onClick={() => handleQuestionTypeChange(selectedQuestionIndex, 'multiple-choice')}
                        >
                            Multiple Choice
                        </div>
                        <div
                            className={`${styles['type-option']} 
                                        ${questions[selectedQuestionIndex].questionType === 'open-ended' ? styles['selected'] : ''}`}
                            onClick={() => handleQuestionTypeChange(selectedQuestionIndex, 'open-ended')}
                        >
                            Open Ended
                        </div>
                        <div
                            className={`${styles['type-option']}
                                        ${questions[selectedQuestionIndex].questionType === 'scaling' ? styles['selected'] : ''}`} 
                            onClick={() => handleQuestionTypeChange(selectedQuestionIndex, 'scaling')}          
                        >
                            Scaling
                        </div>
                        <div
                            className={`${styles['type-option']}
                                        ${questions[selectedQuestionIndex].questionType === 'checkbox' ? styles['checkbox'] : ''}`} 
                            onClick={() => handleQuestionTypeChange(selectedQuestionIndex, 'checkbox')}
                        >
                            Checkbox
                        </div>
                    </div>

                    {questions[selectedQuestionIndex].questionType === 'multiple-choice' && (
                        <>
                            <label>Multiple Choice Options</label>
                            {questions[selectedQuestionIndex].options && questions[selectedQuestionIndex].options.map((option, optIndex) =>(
                                <div key={optIndex}>
                                    <input 
                                        className={styles['multiple-choice-option']}
                                        type='text'
                                        value={option}
                                        onChange={(e) =>{
                                            const updatedQuestions = [...questions];
                                            updatedQuestions[selectedQuestionIndex].options[optIndex] = e.target.value;
                                            setQuestions(updatedQuestions);
                                        }} 
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {questions[selectedQuestionIndex].questionType === 'open-ended' && (
                        <>
                          <label>Open ended</label>
                            <textarea 
                              className={styles['open-ended-option']}
                              value={questions[selectedQuestionIndex].answer || ''}
                              onChange={(e) =>{
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[selectedQuestionIndex].answer = e.target.value;
                                  setQuestions(updatedQuestions);
                              }} 
                            />
                        </>
                    )}

                    {questions[selectedQuestionIndex].questionType === 'scaling' && (
                        <>
                            <label>Ratings</label>
                            <div className={styles['rating-type-grid']}>
                                {['numeric-rating', 'star-rating', 'thumbs-up-down', 'emoji-rating', 'label-slider'].map((type) => (
                                <div
                                    key={type}
                                    className={`${styles['type-option']} ${questions[selectedQuestionIndex].ratingType === type ? styles['selected'] : ''}`}
                                    onClick={() => handleRatingTypeChange(selectedQuestionIndex, type)}
                                >
                                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </div>
                                ))}
                            </div>
                            <div>
                                {renderRatingComponent()}
                            </div>
                        </>
                    )}

                    {questions[selectedQuestionIndex].questionType === 'checkbox' && (
                        <>
                            <label>Checkbox Options</label>
                            {questions[selectedQuestionIndex].options && questions[selectedQuestionIndex].options.map((option, optIndex) =>(
                                <div 
                                  key={optIndex}
                                  className={styles['checkbox-option']}
                                >
                                <input 
                                    type='checkbox'
                                    value={option.checked || false}
                                    onChange={(e) =>{
                                        const updatedQuestions = [...questions];
                                        updatedQuestions[selectedQuestionIndex].options[optIndex].checked = e.target.checked;
                                        setQuestions(updatedQuestions);
                                    }}
                                />
                                <input 
                                  type='text'
                                  value={option.label}
                                  onChange={(e) =>{
                                    const updatedQuestions = [...questions];
                                    updatedQuestions[selectedQuestionIndex].options[optIndex].label = e.target.value;
                                    setQuestions(updatedQuestions);
                                  }}
                                />
                                <button
                                  type='button'
                                  onClick={() =>{
                                    const updatedQuestions = [...questions];
                                    updatedQuestions[selectedQuestionIndex].options.splice(optIndex, 1);
                                    setQuestions(updatedQuestions);
                                  }}
                                >
                                  Remove
                                </button>
                            </div>
                            ))}
                            <button
                              type='button'
                              onClick={() =>{
                                const updatedQuestions = [...questions];
                                updatedQuestions[selectedQuestionIndex].options.push({ label: '', checked: false });
                                setQuestions(updatedQuestions);
                              }}
                            >
                              +Add
                            </button>
                        </>
                    )}
                </label>
            </div>


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
                    <option value="column">Column Layout</option>
                    <option value="grid">Grid Layout</option>
                </select>
            </label>

            {/* Checkbox for required question */}
            <div className={styles['required-checkbox']}>
                    <label>Required</label>
                        <input 
                            type='checkbox'
                            checked={questions[selectedQuestionIndex].isRequired || false}
                            onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[selectedQuestionIndex].isRequired = e.target.checked;
                                setQuestions(updatedQuestions);
                            }} 
                        />
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