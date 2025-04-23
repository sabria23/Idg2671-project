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

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import UAParser from 'ua-parser-js';
import axios from 'axios';
import '../../styles/displaySurvey.css';

import {
  DirectSelectionUI,
  StarRatingUI,
  NumericRatingUI,
  EmojiRatingUI,
  RankingUI,
  renderArtifactContent
} from '/components/QuestionTypes';


const SurveyPage = ({ mode = 'live' }) => {
  const { studyId } = useParams();
  const isPreview = mode === 'preview';

  const [step, setStep] = useState(0) // For managing the steps of the study 0 = intro, 1 = Demographics, 3 questions, 4 = submission and thank you
  const [studyInfo, setStudyInfo] = useState(null); // For title and description of the study
  const [demographics, setDemographics] = useState({age:'', gender:''});
  const [sessionId, setSessionId] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [responses, setResponses] = useState({});
  
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  

useEffect(() => {
    const fetchQuestion = async () => {
      if (currentStep < 2) return; // Skip if not in question phase
      const page = currentStep - 2;

      try {
        const res = await axios.get(`/api/survey/${studyId}/questions/${page}&sessionId=${sessionId}`);
        const data = res.data;

        setStudyInfo({ title: data.title, description: data.description });
        setCurrentQuestion({
          ...data.question,
          artifacts: shuffleArray(data.question.artifacts || []) // Shuffle artifacts for the question
        });
        setTotalQuestions(data.totalQuestions);
      } catch (err) {
        console.error('Error fetching question:', err);
      }
    };
    fetchQuestion();
  }, [currentStep, studyId, sessionId]);


  const handleDemographics = async (e) => {
    e.preventDefault();
    // if the page is in preview mode skip to questions
    if (isPreview) {
        setCurrentStep(2);
        return;
    }

    // UAParser to get the device information
    const parser = new UAParser();
    const result = parser.getResult();
    const browser = result.browser.name || 'Unknown browser';
    const os = result.os.name || 'Unknown os';

    const deviceInfo = `${browser} on ${os}`;

    try {
      const res = await axios.post(`/api/survey/${studyId}/sessions`, {
        deviceInfo,
        demographics
      });
      setSessionId(res.data.sessionId);
      setStep(2); // Go to the first question
    } catch (err) {
      console.error('Error creating session:', err);
    }
};

const handleAnswer = async (responseValue, skipped = false) => {
  if (isPreview) {
    setCurrentStep(prev => prev + 1);
    return;
  }

  const questionId = currentQuestion._id;

  try {
      await axios.post(`/api/survey/${studyId}/sessions/${sessionId}/${questionId}`, {
          participantAnswer: skipped ? null : responseValue,
          skipped,
          answerType: currentQuestion.questionType
      });
      
  } catch (err) {
      if (err.response?.status === 409) {
          await axios.put(`/api/survey/${studyId}/sessions/${sessionId}/${questionId}`, {
              participantAnswer: responseValue,
              skipped,
              answerType: currentQuestion.questionType
          });
      } else {
        console.error('Error submitting answer:', err);
      }
  }
  setCurrentStep(prev => prev + 1)
};

useEffect(() => {
  const completeSession = async () => {
    if (!isPreview && sessionId && currentStep === totalQuestions + 2) {
      try {
        await axios.patch(`/api/survey/${studyId}/sessions/${sessionId}/complete`);
      } catch (err) {
        console.error('Error completing session:', err);
      }
    }
  };
  completeSession();
}, [currentStep]);

const handleNextQuestion = () => setCurrentStep(prev => prev + 1);
const handlePreviousQuestion = () => setCurrentStep(prev => Math.max(prev - 1, 2));


if (step === 0) {
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
  )
}

  // Render demographics form
  if (currentStep === 1) {
    return (
      <div className="survey-container">
        <div className="demographics-container">
          <h2>Before we begin</h2>
          <p>Please provide some information about yourself.</p>
          
          <form onSubmit={handleDemographics} className="demographics-form">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                min="0"
                max="130"
                value={demographics.age} 
                onChange={(e) => setDemographics({...demographics, age: e.target.value})}
                required
              />
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

if (!currentQuestion) {
   return <div className='survey-container'>Loading...</div>
}

if (currentQuestion) {
  const questionIndex = currentStep - 2;
  
  return (
    <div className="survey-container">
      <div className="question-container">
        <div className="question-header">
          <div className="question-progress">
            <div className="progress-text">
              Question {questionIndex + 1} of {totalQuestions}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          <h2>{currentQuestion.questionText}</h2>
        </div>
        
        {currentQuestion.questionType === 'selection' && (
          <DirectSelectionUI question={currentQuestion} onSelect={handleAnswerSubmit} />
        )}

        {currentQuestion.questionType === 'star-rating' && (
          <StarRatingUI question={currentQuestion} onRate={handleAnswerSubmit} />
        )}

        {currentQuestion.questionType === 'numeric-rating' && (
          <NumericRatingUI question={currentQuestion} onRate={handleAnswerSubmit} />
        )}

        {currentQuestion.questionType === 'emoji-rating' && (
          <EmojiRatingUI question={currentQuestion} onRate={handleAnswerSubmit} />
        )}

        {currentQuestion.questionType === 'ranking' && (
          <RankingUI question={currentQuestion} onRank={handleAnswerSubmit} />
        )}

        <button onClick={() => handleAnswer(null, true)}>Skip</button>
        
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
            disabled={!hasValidResponse() && currentQuestion.questionType !== 'selection'}
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}

};

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

  // Check if current question has a valid response
  const hasValidResponse = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return false;
    
    const response = responses[currentQuestion.id];
    
    switch (currentQuestion.questionType) {
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






  // Render question with appropriate comparison method

  




export default SurveyPage;

return null;


