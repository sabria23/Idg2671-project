import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import SurveyIntro from './components/SurveyIntro';
import SurveyDemographics from './components/SurveyDemographics';
import SurveyQuestion from './components/SurveyQuestion';
import SurveyThanks from './components/SurveyThanks';
import { shuffleArray } from '../../utils/shuffleArray';
import '../../styles/displaySurvey.css';

export default function SurveyPage({ mode = 'live' }) {
  const { studyId } = useParams();
  const isPreview = mode === 'preview';

  // Steps: 0=Intro, 1=Demographics, 2..Q+1=Questions, Q+2=Thanks
  const [currentStep, setCurrentStep] = useState(0);
  const [studyInfo, setStudyInfo] = useState(null);

  const [totalQuestions, setTotalQuestions] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [demographicsConfig, setDemographicsConfig] = useState(null);  // New state for demographics


  const responseMap = useRef({});

  // 1. Fetch study metadata
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(
          `/api/survey/${studyId}?page=0&preview=${isPreview}`
        );
        const { title, description, totalQuestions: tq } = res.data;
        setStudyInfo({ title, description });
        setTotalQuestions(tq);

        // Store demographics configuration
        setDemographicsConfig(res.data.demographics || { enabled: false, fields: [] });

      } catch (err) {
        console.error('Failed to load study metadata', err);
      }
    };
    fetchMeta();
  }, [studyId, isPreview]);

  // 2. Initialize or resume
  useEffect(() => {
    if (totalQuestions == null) return;

    if (isPreview) {
      setCurrentStep(2);
      return;
    }

    // Completed?
    if (localStorage.getItem(`survey-completed-${studyId}`) === 'true') {
      setCurrentStep(totalQuestions + 2);
      return;
    }

    // Resume existing session
    const storedSid = localStorage.getItem(`survey-session-${studyId}`);
    const storedStep = localStorage.getItem(`survey-step-${studyId}`);
    if (storedSid) {
      setSessionId(storedSid);
      const stepNum = parseInt(storedStep, 10);
      if (!isNaN(stepNum) && stepNum >= 2 && stepNum <= totalQuestions + 1) {
        setCurrentStep(stepNum);
        return;
      }
    }

    setCurrentStep(0);
  }, [isPreview, studyId, totalQuestions]);

  // 3. Fetch question when on question step
  useEffect(() => {
    if (currentStep < 2) return;
    if (!isPreview && !sessionId) return;
    if (totalQuestions == null) return;

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
        if (previousResponseId) {
          responseMap.current[question._id] = previousResponseId;
        }
      } catch (err) {
        console.error('Failed to fetch question', err);
      }
    })();
  }, [currentStep, sessionId, studyId, isPreview, totalQuestions]);

  // 4. Persist session and step
  useEffect(() => {
    if (!isPreview && sessionId) {
      localStorage.setItem(`survey-session-${studyId}`, sessionId);
    }
  }, [sessionId, studyId, isPreview]);

  useEffect(() => {
    if (!isPreview && totalQuestions != null) {
      localStorage.setItem(`survey-step-${studyId}`, currentStep);
    }
  }, [currentStep, studyId, isPreview, totalQuestions]);

  // Handlers
  const handleStart = async () => {
    if (isPreview) {
      // In preview mode, always skip to questions
      setCurrentStep(2);
      return;
    }
    
    if (sessionId) return; // already started
  
    try {
      const parser = new UAParser();
      const info = parser.getResult();
      const deviceInfo = `${info.browser.name || 'Browser'} on ${info.os.name || 'OS'}`;
      const res = await axios.post(`/api/survey/${studyId}/sessions`, { deviceInfo });
      setSessionId(res.data.sessionId);
      
      // Check if demographics are enabled - if not, skip directly to questions
      if (!demographicsConfig || !demographicsConfig.enabled) {
        setCurrentStep(2); // Skip to questions
      } else {
        setCurrentStep(1); // Show demographics
      }
    } catch (err) {
      console.error('Failed to start session', err);
      alert('Could not start session. Please try again.');
    }
  };

  const handleDemographics = async (demo) => {
    if (isPreview) {
      setCurrentStep(2);
      return;
    }
    try {
      await axios.post(
        `/api/survey/${studyId}/sessions/${sessionId}/demographics`,
        demo
      );
      setDemographics(demo);
      setCurrentStep(2);
    } catch (err) {
      console.error('Failed to submit demographics', err);
    }
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

  const handlePrevious = () => {
    if (currentStep > 2) setCurrentStep((s) => s - 1);
  };

  const handleNext = () => {
    if (currentStep === totalQuestions + 1) {
      localStorage.setItem(`survey-completed-${studyId}`, 'true');
    }
    setCurrentStep((s) => s + 1);
  };

  // Render
  if (currentStep === 0) {
    return (
      <SurveyIntro
        studyInfo={studyInfo}
        totalQuestions={totalQuestions}
        onStart={handleStart}
      />
    );
  }
   
   // Render demographics page
   if (currentStep === 1) {
    return (
      <SurveyDemographics 
        studyId={studyId}
        sessionId={sessionId}
        onSubmit={handleDemographics} 
        onBack={() => setCurrentStep(0)}
        demographicsConfig={demographicsConfig}
      />
    );
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

  return <SurveyThanks />;
}