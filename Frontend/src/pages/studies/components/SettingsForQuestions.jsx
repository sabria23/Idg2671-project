import React from 'react';
import styles from '../styles/QuestionBuilder.module.css';
import NumericRating from './NumericRating';
import ThumbsUpDown from './ThumbsUpDown';
import StarRating from './StarRating';
import EmojiRating from './EmojiRating';
import LabelSlider from './LabelSlider';
import { FaRegTimesCircle } from "react-icons/fa";

const ratingTypes = [
  'numeric-rating',
  'star-rating',
  'thumbs-up-down',
  'emoji-rating',
  'label-slider'
];

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

    const renderRatingComponent = () => {
      switch(currentQuestion.questionType){
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
            return null;
      }
    };

    return(
        <div className={styles['question-settings']}>
            <h3>Question Settings</h3>

            {/* Question Text */}
            <div className={styles['question-text']}>
                <label>
                    Question Text
                    <input
                        className={styles['question-title']}
                        type="text"
                        value={currentQuestion.questionTitle}
                        onChange={(e) =>
                            handleQuestionTitleChange(selectedQuestionIndex, e.target.value)
                        }
                    />
                </label>
            </div>

            <div className={styles['question-type']}>
                <label>
                  Question Type
                  <div className={styles['question-type-grid']}>
                    {['multiple-choice', 'open-ended', 'checkbox', ...ratingTypes].map((type) => (
                      <div
                        key={type}
                        className={`${styles['type-option']} ${currentQuestion.questionType === type ? styles['selected'] : ''}`}
                        onClick={() => handleQuestionTypeChange(selectedQuestionIndex, type)}
                      >
                        {type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    ))}
                  </div>

                    {questions[selectedQuestionIndex].questionType === 'multiple-choice' && (
                        <>
                            <label>Multiple Choice Options</label>
                            {currentQuestion.options && currentQuestion.options.map((option, optIndex) =>(
                                <div key={optIndex}>
                                    <input 
                                        className={styles['multiple-choice-option']}
                                        type='text'
                                        value={option.label}
                                        placeholder='Option Label'
                                        onChange={(e) =>{
                                            const updatedQuestions = [...questions];
                                            updatedQuestions[selectedQuestionIndex].options[optIndex].label = e.target.value;
                                            updatedQuestions[selectedQuestionIndex].options[optIndex].value = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                            setQuestions(updatedQuestions);
                                        }} 
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {currentQuestion.questionType === 'open-ended' && (
                        <>
                          <label>Open ended</label>
                            <textarea 
                              className={styles['open-ended-option']}
                              value={currentQuestion.answer || ''}
                              onChange={(e) =>{
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[selectedQuestionIndex].answer = e.target.value;
                                  setQuestions(updatedQuestions);
                              }} 
                            />
                        </>
                    )}

                    {ratingTypes.includes(currentQuestion.questionType) && (
                      <>
                        <label>Ratings</label>
                        {renderRatingComponent()}
                      </>
                    )}

                    {currentQuestion.questionType === 'checkbox' && (
                        <>
                            <label>Checkbox Options</label>
                            {currentQuestion.options && currentQuestion.options.map((option, optIndex) =>(
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
                                    updatedQuestions[selectedQuestionIndex].options[optIndex].value = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                    setQuestions(updatedQuestions);
                                  }}
                                />
                                <button
                                  className={styles['checkboxRemove']}
                                  type='button'
                                  onClick={() =>{
                                    const updatedQuestions = [...questions];
                                    updatedQuestions[selectedQuestionIndex].options.splice(optIndex, 1);
                                    setQuestions(updatedQuestions);
                                  }}
                                >
                                  <FaRegTimesCircle />
                                </button>
                            </div>
                            ))}
                            <button
                              className={styles['checkboxAdd']}
                              type='button'
                              onClick={() =>{
                                const updatedQuestions = [...questions];
                                updatedQuestions[selectedQuestionIndex].options.push({ label: '', value: '' });
                                setQuestions(updatedQuestions);
                              }}
                            >
                              +Add option
                            </button>
                        </>
                    )}
                </label>
            </div>


            {/* Layout Template */}
            <label>
                Layout Template
                <select
                    value={currentQuestion.layout || 'row'}
                    onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[selectedQuestionIndex].layout = e.target.value;
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
                            checked={currentQuestion.isRequired || false}
                            onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[selectedQuestionIndex].isRequired = e.target.checked;
                                setQuestions(updatedQuestions);
                            }} 
                        />
                        <p>Select this box if the question is required to be answered</p>
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