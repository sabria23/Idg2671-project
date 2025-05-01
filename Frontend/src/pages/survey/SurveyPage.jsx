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

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {UAParser} from 'ua-parser-js';

import SurveyIntro from "./components/SurveyIntro";
import SurveyDemographics from "./components/SurveyDemographics";
import SurveyQuestion from "./components/SurveyQuestion";
import SurveyThankYou from "./components/SurveyThanks";

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

  useEffect(() => {
    const fetchStudyInfo = async () => {
      try {
        const res = await axios.get(`/api/survey/${studyId}`);
        setStudyInfo({
          title: res.data.title,
          description: res.data.description
        });
      } catch (err) {
        console.error("Failed to fetch study info:", err);
      }
    };
    fetchStudyInfo();
  }, [studyId]);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (currentStep < 2) return;
      const page = currentStep - 2;
      try {
        const res = await axios.get(`/api/survey/${studyId}?page=${page}&sessionId=${sessionId}`);
        const data = res.data;
        setCurrentQuestion({
          ...data.question,
          artifacts: shuffleArray(data.question.artifacts || [])
        });
        setTotalQuestions(data.totalQuestions);
      } catch (err) {
        console.error('Failed to fetch question:', err);
      }
    };
    fetchQuestion();
  }, [currentStep, sessionId, studyId]);

  const handleDemographicsSubmit = async (e) => {
    e.preventDefault();
    if (isPreview) {
      setCurrentStep(2);
      return;
    }
    const parser = new UAParser();
    const result = parser.getResult();
    const deviceInfo = `${result.browser.name || 'Unknown Browser'} on ${result.os.name || 'Unknown OS'}`;

    try {
      const res = await axios.post(`/api/survey/${studyId}/sessions`, {
        demographics,
        deviceInfo
      });
      setSessionId(res.data.sessionId);
      setCurrentStep(2);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleAnswerSubmit = async (responseValue, skipped = false) => {
    if (isPreview) {
      setCurrentStep(prev => prev + 1);
      return;
    }
    const questionId = currentQuestion._id;
    try {
      await axios.post(`/api/studies/${studyId}/sessions/${sessionId}/${questionId}`, {
        answer: skipped ? null : responseValue,
        skipped,
        answerType: currentQuestion.questionType
      });
    } catch (err) {
      if (err.response?.status === 409) {
        await axios.patch(`/api/studies/${studyId}/sessions/${sessionId}/${questionId}`, {
          answer: skipped ? null : responseValue,
          skipped,
          answerType: currentQuestion.questionType
        });
      } else {
        console.error('Failed to submit answer', err);
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousQuestion = () => setCurrentStep(prev => Math.max(prev - 1, 2));
  const handleNextQuestion = () => setCurrentStep(prev => prev + 1);

  if (currentStep === 0) {
    return <SurveyIntro studyInfo={studyInfo} totalQuestions={totalQuestions} onStart={() => setCurrentStep(1)} />;
  }

  if (currentStep === 1) {
    return (
      <SurveyDemographics 
        demographics={demographics}
        setDemographics={setDemographics}
        onSubmit={handleDemographicsSubmit}
        onBack={() => setCurrentStep(0)}
      />
    );
  }

  if (currentStep >= 2 && currentStep < totalQuestions + 2) {
    return (
      <SurveyQuestion
        currentQuestion={currentQuestion}
        onAnswer={handleAnswerSubmit}
        onSkip={() => handleAnswerSubmit(null, true)}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
      />
    );
  }

  return <SurveyThankYou />;
};

export default SurveyPage;




