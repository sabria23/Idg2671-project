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

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import SurveyIntro from './components/SurveyIntro';
import SurveyDemographics from './components/SurveyDemographics';
import SurveyQuestion from './components/SurveyQuestion';
import SurveyThankYou from './components/SurveyThanks';
import { submitDemographics } from '../../utils/submitDemographics';
import { shuffleArray } from '../../utils/shuffleArray';
import '../../styles/displaySurvey.css';

const SurveyPage = ({ mode = 'live' }) => {
  const { studyId } = useParams();
  const isPreview = mode === 'preview';

  const [currentStep, setCurrentStep] = useState(0);
  const [studyInfo, setStudyInfo] = useState(null);
  const [demographics, setDemographics] = useState({ age: '', gender: '' });
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const responseMap = useRef({});

  // 1. Fetch study metadata (title, desc, totalQuestions)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(`/api/survey/${studyId}?page=0&preview=${isPreview}`);
        setStudyInfo({ title: res.data.title, description: res.data.description });
        setTotalQuestions(res.data.totalQuestions);
      } catch (err) {
        console.error('Failed to load study meta', err);
      }
    };
    fetchMeta();
  }, [studyId, isPreview]);

  // 2. Resume or completed logic
  useEffect(() => {
    if (isPreview || totalQuestions === 0) return;

    // If completed, jump to thank you
    if (localStorage.getItem(`survey-completed-${studyId}`) === 'true') {
      setCurrentStep(totalQuestions + 2);
      return;
    }

    const storedSid = localStorage.getItem(`survey-session-${studyId}`);
    if (!storedSid) return;

    setSessionId(storedSid);
    (async () => {
      try {
        const { data } = await axios.get(
          `/api/survey/${studyId}?resume=true&sessionId=${storedSid}`
        );
        const { question, currentIndex, previousResponseId, previousAnswer } = data;

        // If they've answered all questions, mark completed
        if (currentIndex + 1 >= totalQuestions) {
          localStorage.setItem(`survey-completed-${studyId}`, 'true');
          setCurrentStep(totalQuestions + 2);
          return;
        }

        // Otherwise resume at that question
        setCurrentStep(currentIndex + 2);
        setCurrentQuestion({
          ...question,
          artifacts: shuffleArray(question.artifacts || []),
          previousAnswer
        });
        if (previousResponseId) responseMap.current[question._id] = previousResponseId;
      } catch (err) {
        console.error('Failed to resume survey', err);
      }
    })();
  }, [studyId, isPreview, totalQuestions]);

  // 3. Fetch current question when step changes
  useEffect(() => {
    if (isPreview || sessionId == null || currentStep < 2) return;
    const page = currentStep - 2;
    if (page < 0 || page >= totalQuestions) return;

    (async () => {
      try {
        const url = isPreview
          ? `/api/survey/${studyId}?page=${page}&preview=true`
          : `/api/survey/${studyId}?page=${page}&sessionId=${sessionId}`;
        const res = await axios.get(url);
        const { question, previousResponseId, previousAnswer } = res.data;
        setCurrentQuestion({
          ...question,
          artifacts: shuffleArray(question.artifacts || []),
          previousAnswer
        });
        if (previousResponseId) responseMap.current[question._id] = previousResponseId;
      } catch (err) {
        console.error('Failed to fetch question', err);
      }
    })();
  }, [currentStep, sessionId, studyId, isPreview, totalQuestions]);

  // 4. Persist sessionId & step to localStorage
  useEffect(() => {
    if (!isPreview && sessionId) {
      localStorage.setItem(`survey-session-${studyId}`, sessionId);
    }
  }, [sessionId, studyId, isPreview]);

  useEffect(() => {
    if (!isPreview) {
      localStorage.setItem(`survey-step-${studyId}`, currentStep);
    }
  }, [currentStep, studyId, isPreview]);

  // Handlers
  const handleStart = async () => {
    if (isPreview) return setCurrentStep(2);
    if (sessionId) return; // already started

    try {
      const parser = new UAParser();
      const info = parser.getResult();
      const res = await axios.post(`/api/survey/${studyId}/sessions`, {
        deviceInfo: `${info.browser.name || 'Browser'} on ${info.os.name || 'OS'}`
      });
      setSessionId(res.data.sessionId);
      setCurrentStep(1);
    } catch (err) {
      console.error('Failed to start session', err);
      alert('Could not start. Try again.');
    }
  };

  const handleDemographics = async (demo) => {
    if (isPreview) return setCurrentStep(2);
    const ok = await submitDemographics(studyId, sessionId, demo);
    if (ok) setCurrentStep(2);
  };

  const handleAnswerSubmit = async (answer, skipped = false) => {
    if (isPreview) return;
    const qid = currentQuestion._id;
    const existing = responseMap.current[qid];
    try {
      if (existing) {
        await axios.patch(
          `/api/survey/${studyId}/sessions/${sessionId}/responses/${existing}`,
          { participantAnswer: skipped ? null : answer, skipped }
        );
      } else {
        const res = await axios.post(
          `/api/survey/${studyId}/sessions/${sessionId}/responses`,
          { questionId: qid, participantAnswer: skipped ? null : answer, skipped }
        );
        responseMap.current[qid] = res.data.responseId;
      }
    } catch (err) {
      console.error('Failed to submit answer', err);
    }
  };

  const handlePrevious = () => setCurrentStep((s) => Math.max(s - 1, 2));

  const handleNext = () => {
    // if last question, mark complete
    if (currentStep === totalQuestions + 1) {
      localStorage.setItem(`survey-completed-${studyId}`, 'true');
    }
    setCurrentStep((s) => s + 1);
  };

  // Render
  if (currentStep === 0) {
    return <SurveyIntro studyInfo={studyInfo} totalQuestions={totalQuestions} onStart={handleStart} />;
  }
  if (currentStep === 1) {
    return <SurveyDemographics demographics={demographics} onSubmit={handleDemographics} onBack={() => setCurrentStep(0)} />;
  }
  if (currentStep >= 2 && currentStep <= totalQuestions + 1) {
    return (
      <SurveyQuestion
        currentQuestion={currentQuestion}
        onAnswer={handleAnswerSubmit}
        onSkip={() => handleAnswerSubmit(null, true)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isLast={currentStep === totalQuestions + 1}
      />
    );
  }
  return <SurveyThankYou />;
};

export default SurveyPage;