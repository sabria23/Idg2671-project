/*import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
//import UAParser from 'ua-parser-js';
import axios from 'axios';
import '../../styles/displaySurvey.css';

// IMPORTANT! Code should be splitted to components and have buttons for next and back!

// make props for the page if it should be the real thing or a preview
// a mode='preview' and a mode='live', preview will be accessible from the createStudy page and live from the link
export default function SurveyPage({ mode = 'live' }) {
    const {studyId} = useParams(); 
    const isPreview = mode === 'preview'; // Check if the page is in preview mode
}




const [step, setStep] = useState(0) // For managing the steps of the study 0 = intro, 1 = Demographics, 3 questions, 4 = submission and thank you
const [studyInfo, setStudyInfo] = useState(null); // For title and description of the study

// UseState to manage the demographics info and the session status to separate preview and live
const [demographics, setDemographics] = useState({age:'', gender:''});
const [sessionId, setSessionId] = useState(null);

const [currentQuestion, setCurrentQuestion] = useState(null); 
const [totalQuestions, setTotalQuestions] = useState(0); 

// STEP 0 - INTRODUCTION

// Fetching the study info
useEffect(() => {
    const fetchStudy = async () => {
        const res = await axios.get(`/api/survey/${studyId}`);
        setStudyInfo(res.data);
    };
    fetchStudy();
}, [studyId]);

useEffect(() => {
    if (!sessionId || !isPreview) return; // Only get questions when past the demographics
    
    
    const fetchQuestion = async () => {
        const page = step - 2;
        const res = await axios.get(`/api/survey/${studyId}/questions/${page}&sessionId=${sessionId}`);
        setCurrentQuestion(res.data.question);
        setTotalQuestions(res.data.totalQuestions);
    };
    fetchQuestion();
}, [step, studyId, sessionId]);

const handleStart = () => setStep(1); // Go from the intro to demographics

// STEP 1 - DEMOGRAPHICS

// Handles the demographics and sends it to the backend and then receives the sessionId and proceeds to questions
const handleDemographics = async () => {
    // if the page is in preview mode skip to questions
    if (isPreview) {
        setStep(2);
        return;
    }
    // UAParser to get the device information
    /*const parser = new UAParser();
    const result = parser.getResult();
    const browser = result.browser.name || 'Unknown browser';
    const os = result.os.name || 'Unknown os';

    const deviceInfo = `${browser} on ${os}`;

    const res = await axios.post(`/api/survey/${studyId}/sessions`, {
        deviceInfo,
        demographics
    });
    setSessionId(res.data.sessionId);
    setStep(2); // Go to the first question
};

// STEP 2 - QUESTIONS

const handleAnswer = async (submitAnswer, skipped = false) => {
    const questionId = currentQuestion._id;
    try {
        await axios.post(`/api/survey/${studyId}/sessions/${sessionId}/${questionId}`, {
            participantAnswer: skipped ? null : submitAnswer,
            skipped,
            answerType: currentQuestion.questionType
        });
        
    } catch (err) {
        if (err.response?.status === 409) {
            await axios.put(`/api/survey/${studyId}/sessions/${sessionId}/${questionId}`, {
                participantAnswer: submitAnswer,
                skipped,
                answerType: currentQuestion.questionType
            });
        }
    }
    setStep(prev => prev + 1)
}



// STEP 3 - SUBMISSION AND THANK YOU
// WIP




if (step === 0) {
    return (
        <div>
            <h1>{studyInfo.title}</h1>
            <p>{studyInfo.description}</p>
            <button onClick={handleStart}>Start</button>
        </div>
    )
}
 !IMPORTANT! prefer not to say should maybe be otheroption instead
if (step === 1) {
    return (
        <div>
            <h1>Demographics</h1>

                <label>Age:</label>
                <select value={demographics.age} onChange={(e) = setDemographics(prev => ({...prev, age: e.target.value}))}>
                    <option value="">Select</option>
                    <option value="under 18">under 18</option>
                    <option value="18-25">18-25</option>
                    <option value="25-35">25-35</option>
                    <option value="35-45">35-45</option>
                    <option value="45-55">45-55</option>
                    <option value="55-65">55-65</option>
                    <option value="65+">65+</option>
                </select>

                <label>Gender:</label>
                <select value={demographics.gender} onChange={(e) = setDemographics(prev => ({...prev, gender: e.target.value}))}>
                    <option value="">Select</option>
                    <option value="female">female</option>
                    <option value="male">male</option>
                    <option value="prefer_not_to_say">prefer not to say</option>
                </select>

                <button 
                onClick={handleDemographics}
                disabled={!demographics.age || !demographics.gender}
                >Next</button>            
        </div>
    )
}

Check if all of the questions have been answered and complete the session
add completed logic!
if (step >= 2 && step - 2 >= totalQuestions) {
    return (
        <div>
            <h1>Thank you for your participation!</h1>
            <p>Your responses have been submitted.</p>
        </div>
    )
}

Question display logic INCOMPLETE
if (step >= 2 && currentQuestion) {
    return (
        <div>
            <h1>{currentQuestion.questionText}</h1>
            {currentQuestion.questionType}
            <div className="question-options">
                {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                        <input type="radio" name="option" value={option.value} onChange={(e) => handleAnswer(e.target.value)} />
                        <label>{option.label}</label>
                    </div>
                ))}
                <button onClick={() => handleAnswer(null, true)}>Skip</button>
            </div>
            <button onClick={() => setStep(prev => prev - 1)}>Back</button>
            <button onClick={() => handleAnswer(null)}>Next</button>
        </div>
    )
}*/

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/displaySurvey.css';

const SurveyPage = ({ mode = 'live' }) => {
  const { studyId } = useParams();
  const isPreview = mode === 'preview';
  
  // Sample study data
  const studyInfo = {
    title: 'Artifact Comparison Study',
    description: 'This study aims to collect user preferences between different types of artifacts. Your feedback will help improve our design choices.'
  };
  
  // Simple state to track which step/page we're on
  const [currentStep, setCurrentStep] = useState(0);
  const [demographics, setDemographics] = useState({ age: '', gender: '' });
  const [responses, setResponses] = useState({});

  // Sample questions with different rating types
  const questions = [
    {
      id: 1,
      questionText: 'Which image do you prefer?',
      comparisonType: 'selection', // Direct selection from options
      artifacts: [
        { id: 'a1', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+1' },
        { id: 'a2', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+2' },
        { id: 'a3', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+3' },
        { id: 'a4', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+4' },
        { id: 'a5', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+5' },
        { id: 'a6', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+6' }
      ],
    },
    {
      id: 2,
      questionText: 'Rate each audio sample on a scale of 1-5',
      comparisonType: 'star-rating', // Star rating for each item
      artifacts: [
        { id: 'a7', type: 'audio', url: 'https://example.com/audio1.mp3', label: 'Audio Sample 1' },
        { id: 'a8', type: 'audio', url: 'https://example.com/audio2.mp3', label: 'Audio Sample 2' },
      ],
    },
    {
      id: 3,
      questionText: 'On a scale of 1-10, how would you rate this video?',
      comparisonType: 'numeric-rating', // Numeric scale
      artifacts: [
        { id: 'a9', type: 'video', url: 'https://example.com/video1.mp4', label: 'Video Sample' },
      ],
    },
    {
      id: 4,
      questionText: 'How do you feel about this text?',
      comparisonType: 'emoji-rating', // Emoji-based rating
      artifacts: [
        { id: 'a10', type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo eu nunc cursus fringilla.', label: 'Text Sample' },
      ],
    },
    {
      id: 5,
      questionText: 'Rank these images from most to least preferred',
      comparisonType: 'ranking', // Ordering/ranking
      artifacts: [
        { id: 'a11', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+A' },
        { id: 'a12', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+B' },
        { id: 'a13', type: 'image', url: 'https://via.placeholder.com/300x200?text=Image+C' },
      ],
    }
  ];

  // Get current question based on step
  const getCurrentQuestion = () => {
    // The first step (0) is intro, second step (1) is demographics
    // Questions start at step 2
    const questionIndex = currentStep - 2;
    if (questionIndex >= 0 && questionIndex < questions.length) {
      return questions[questionIndex];
    }
    return null;
  };

  // Response handlers for different question types
  const handleSelectionResponse = (questionId, artifactId) => {
    setResponses({
      ...responses,
      [questionId]: artifactId
    });
  };

  const handleStarRating = (questionId, artifactId, rating) => {
    setResponses({
      ...responses,
      [questionId]: {
        ...(responses[questionId] || {}),
        [artifactId]: rating
      }
    });
  };

  const handleNumericRating = (questionId, artifactId, rating) => {
    setResponses({
      ...responses,
      [questionId]: {
        ...(responses[questionId] || {}),
        [artifactId]: rating
      }
    });
  };

  const handleEmojiRating = (questionId, artifactId, emoji) => {
    setResponses({
      ...responses,
      [questionId]: {
        ...(responses[questionId] || {}),
        [artifactId]: emoji
      }
    });
  };

  const handleRanking = (questionId, rankedIds) => {
    setResponses({
      ...responses,
      [questionId]: rankedIds
    });
  };

  // Navigation handlers
  const handleStart = () => setCurrentStep(1);
  
  const handleDemographicsSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };
  
  const handleNextQuestion = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePreviousQuestion = () => {
    setCurrentStep(currentStep - 1);
  };

  // Check if current question has a valid response
  const hasValidResponse = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return false;
    
    const response = responses[currentQuestion.id];
    
    switch (currentQuestion.comparisonType) {
      case 'selection':
        return !!response; // Has selected an artifact
      case 'star-rating':
      case 'numeric-rating':
      case 'emoji-rating':
        // Check if all artifacts have ratings
        return currentQuestion.artifacts.every(a => 
          response && response[a.id] !== undefined
        );
      case 'ranking':
        // Check if all artifacts are ranked
        return response && response.length === currentQuestion.artifacts.length;
      default:
        return false;
    }
  };

  // Render intro/landing page
  if (currentStep === 0) {
    return (
      <div className="survey-container">
        <div className="intro-container">
          <h1>{studyInfo.title}</h1>
          <div className="intro-content">
            <p>{studyInfo.description}</p>
            
            <div className="intro-details">
              <div className="intro-detail-item">
                <span className="detail-icon">⏱️</span>
                <span>Approximately {questions.length * 2} minutes</span>
              </div>
              <div className="intro-detail-item">
                <span className="detail-icon">🔍</span>
                <span>{questions.length} questions to answer</span>
              </div>
            </div>
            
            <p className="intro-instructions">
              You will be asked to evaluate different artifacts using various rating methods.
              Please follow the instructions for each question carefully.
            </p>
            
            <button className="primary-button" onClick={handleStart}>
              Start Study
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render demographics form
  if (currentStep === 1) {
    return (
      <div className="survey-container">
        <div className="demographics-container">
          <h2>Before we begin</h2>
          <p>Please provide some information about yourself.</p>
          
          <form onSubmit={handleDemographicsSubmit} className="demographics-form">
            <div className="form-group">
              <label htmlFor="age">Age Group</label>
              <select 
                id="age"
                value={demographics.age} 
                onChange={(e) => setDemographics({...demographics, age: e.target.value})}
                required
              >
                <option value="">Select your age group</option>
                <option value="under 18">Under 18</option>
                <option value="18-25">18-25</option>
                <option value="25-35">25-35</option>
                <option value="35-45">35-45</option>
                <option value="45-55">45-55</option>
                <option value="55-65">55-65</option>
                <option value="65+">65+</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select 
                id="gender"
                value={demographics.gender} 
                onChange={(e) => setDemographics({...demographics, gender: e.target.value})}
                required
              >
                <option value="">Select your gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="secondary-button" 
                onClick={() => setCurrentStep(0)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="primary-button"
                disabled={!demographics.age || !demographics.gender}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render thank you page (last step)
  if (currentStep >= questions.length + 2) {
    return (
      <div className="survey-container">
        <div className="thankyou-container">
          <div className="thankyou-icon">✅</div>
          <h1>Thank You!</h1>
          <p>Your responses have been successfully submitted.</p>
          <p>We appreciate your participation in this study.</p>
        </div>
      </div>
    );
  }

  // Render question with appropriate comparison method
  const currentQuestion = getCurrentQuestion();
  if (currentQuestion) {
    const questionIndex = currentStep - 2;
    
    return (
      <div className="survey-container">
        <div className="question-container">
          <div className="question-header">
            <div className="question-progress">
              <div className="progress-text">
                Question {questionIndex + 1} of {questions.length}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <h2>{currentQuestion.questionText}</h2>
          </div>
          
          {/* Render different comparison UI based on type */}
          {currentQuestion.comparisonType === 'selection' && (
            <DirectSelectionUI 
              question={currentQuestion} 
              selectedId={responses[currentQuestion.id]} 
              onSelect={(artifactId) => handleSelectionResponse(currentQuestion.id, artifactId)} 
            />
          )}
          
          {currentQuestion.comparisonType === 'star-rating' && (
            <StarRatingUI 
              question={currentQuestion} 
              ratings={responses[currentQuestion.id] || {}} 
              onRate={(artifactId, rating) => handleStarRating(currentQuestion.id, artifactId, rating)} 
            />
          )}
          
          {currentQuestion.comparisonType === 'numeric-rating' && (
            <NumericRatingUI 
              question={currentQuestion} 
              ratings={responses[currentQuestion.id] || {}} 
              onRate={(artifactId, rating) => handleNumericRating(currentQuestion.id, artifactId, rating)} 
            />
          )}
          
          {currentQuestion.comparisonType === 'emoji-rating' && (
            <EmojiRatingUI 
              question={currentQuestion} 
              ratings={responses[currentQuestion.id] || {}} 
              onRate={(artifactId, emoji) => handleEmojiRating(currentQuestion.id, artifactId, emoji)} 
            />
          )}
          
          {currentQuestion.comparisonType === 'ranking' && (
            <RankingUI 
              question={currentQuestion} 
              ranking={responses[currentQuestion.id] || []} 
              onRank={(rankedIds) => handleRanking(currentQuestion.id, rankedIds)} 
            />
          )}
          
          <div className="question-navigation">
            <button 
              className="secondary-button" 
              onClick={handlePreviousQuestion}
            >
              Previous
            </button>
            <button 
              className="skip-button" 
              onClick={handleNextQuestion}
            >
              Skip Question
            </button>
            <button 
              className="primary-button"
              onClick={handleNextQuestion}
              disabled={!hasValidResponse() && currentQuestion.comparisonType !== 'selection'}
            >
              Next Question
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return <div className="survey-container">Loading...</div>;
};

// Component for direct selection comparison (choose one from multiple)
const DirectSelectionUI = ({ question, selectedId, onSelect }) => {
  return (
    <div className="artifacts-grid">
      {question.artifacts.map((artifact) => (
        <div 
          key={artifact.id}
          className={`artifact-item ${selectedId === artifact.id ? 'selected' : ''}`}
          onClick={() => onSelect(artifact.id)}
        >
          <div className="artifact-content">
            {renderArtifactContent(artifact)}
          </div>
          <div className="artifact-label">
            {artifact.label || `Option ${question.artifacts.indexOf(artifact) + 1}`}
          </div>
          {selectedId === artifact.id && (
            <div className="selected-indicator">✓</div>
          )}
        </div>
      ))}
    </div>
  );
};

// Component for star rating comparison
const StarRatingUI = ({ question, ratings, onRate }) => {
  return (
    <div className="rating-container">
      {question.artifacts.map((artifact) => (
        <div key={artifact.id} className="rating-item">
          <div className="artifact-content">
            {renderArtifactContent(artifact)}
          </div>
          <div className="artifact-label">
            {artifact.label || `Option ${question.artifacts.indexOf(artifact) + 1}`}
          </div>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                className={`star ${ratings[artifact.id] >= star ? 'filled' : ''}`}
                onClick={() => onRate(artifact.id, star)}
              >
                {ratings[artifact.id] >= star ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Component for numeric rating (1-10 scale)
const NumericRatingUI = ({ question, ratings, onRate }) => {
  return (
    <div className="rating-container">
      {question.artifacts.map((artifact) => (
        <div key={artifact.id} className="rating-item">
          <div className="artifact-content">
            {renderArtifactContent(artifact)}
          </div>
          <div className="artifact-label">
            {artifact.label || `Option ${question.artifacts.indexOf(artifact) + 1}`}
          </div>
          <div className="numeric-rating">
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={ratings[artifact.id] || 5}
              onChange={(e) => onRate(artifact.id, parseInt(e.target.value))}
            />
            <div className="numeric-scale">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <span key={num}>{num}</span>
              ))}
            </div>
            <div className="selected-rating">
              Rating: {ratings[artifact.id] || '-'}/10
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Component for emoji-based rating
const EmojiRatingUI = ({ question, ratings, onRate }) => {
  const emojis = ['😡', '😕', '😐', '🙂', '😄'];
  const emojiLabels = ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent'];
  
  return (
    <div className="rating-container">
      {question.artifacts.map((artifact) => (
        <div key={artifact.id} className="rating-item">
          <div className="artifact-content">
            {renderArtifactContent(artifact)}
          </div>
          <div className="artifact-label">
            {artifact.label || `Option ${question.artifacts.indexOf(artifact) + 1}`}
          </div>
          <div className="emoji-rating">
            {emojis.map((emoji, index) => (
              <button 
                key={index}
                className={`emoji-button ${ratings[artifact.id] === index ? 'selected' : ''}`}
                onClick={() => onRate(artifact.id, index)}
                title={emojiLabels[index]}
              >
                {emoji}
              </button>
            ))}
          </div>
          {ratings[artifact.id] !== undefined && (
            <div className="emoji-label">
              {emojiLabels[ratings[artifact.id]]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Component for ranking items
const RankingUI = ({ question, ranking, onRank }) => {
  // Convert artifacts to a rankable list
  const [rankableItems, setRankableItems] = useState(() => 
    question.artifacts.map(artifact => ({
      ...artifact,
      rank: ranking.indexOf(artifact.id) + 1 || null
    }))
  );

  // Update rankings when a rank is selected
  const updateRanking = (artifactId, newRank) => {
    const updatedItems = rankableItems.map(item => {
      if (item.id === artifactId) {
        return { ...item, rank: newRank };
      }
      // If this rank is already taken by another item, reset that item
      if (item.rank === newRank && item.id !== artifactId) {
        return { ...item, rank: null };
      }
      return item;
    });
    
    setRankableItems(updatedItems);
    
    // Extract ordered IDs for the response
    const orderedIds = updatedItems
      .filter(item => item.rank !== null)
      .sort((a, b) => a.rank - b.rank)
      .map(item => item.id);
      
    onRank(orderedIds);
  };

  return (
    <div className="ranking-container">
      <p className="ranking-instructions">
        Assign a rank to each item (1 = highest, {question.artifacts.length} = lowest)
      </p>
      {rankableItems.map((item) => (
        <div key={item.id} className="ranking-item">
          <div className="artifact-content">
            {renderArtifactContent(item)}
          </div>
          <div className="artifact-label">
            {item.label || `Option ${question.artifacts.indexOf(item) + 1}`}
          </div>
          <div className="rank-selector">
            <label>Rank:</label>
            <select 
              value={item.rank || ''}
              onChange={(e) => updateRanking(item.id, e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Select rank</option>
              {Array.from({ length: question.artifacts.length }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {item.rank && (
              <div className="rank-badge">
                #{item.rank}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to render artifact content based on type
const renderArtifactContent = (artifact) => {
  switch (artifact.type) {
    case 'image':
      return <img src={artifact.url} alt={artifact.label} className="artifact-media" />;
    case 'video':
      return (
        <video controls className="artifact-media">
          <source src={artifact.url} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      );
    case 'audio':
      return (
        <audio controls className="artifact-media">
          <source src={artifact.url} type="audio/mpeg" />
          Your browser does not support audio playback.
        </audio>
      );
    case 'text':
      return <div className="artifact-text">{artifact.content || 'Text content'}</div>;
    default:
      return <div className="artifact-placeholder">Content unavailable</div>;
  }
};

export default SurveyPage;