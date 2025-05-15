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
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [demographicsConfig, setDemographicsConfig] = useState(null);  // New state for demographics

  const responseMap = useRef({});

  // 1. Fetch study metadata (title, desc, totalQuestions)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(`/api/survey/${studyId}?page=0&preview=${isPreview}`);
        setStudyInfo({ title: res.data.title, description: res.data.description });
        setTotalQuestions(res.data.totalQuestions);

        // Store demographics configuration
        setDemographicsConfig(res.data.demographics || { enabled: false, fields: [] });

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
    if (isPreview) {
      // In preview mode, always skip to questions
      setCurrentStep(2);
      return;
    }
    
    if (sessionId) return; // already started
  
    try {
      const parser = new UAParser();
      const info = parser.getResult();
      const res = await axios.post(`/api/survey/${studyId}/sessions`, {
        deviceInfo: `${info.browser.name || 'Browser'} on ${info.os.name || 'OS'}`
      });
      setSessionId(res.data.sessionId);
      
      // Check if demographics are enabled - if not, skip directly to questions
      if (!demographicsConfig || !demographicsConfig.enabled) {
        setCurrentStep(2); // Skip to questions
      } else {
        setCurrentStep(1); // Show demographics
      }
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
  return <SurveyThankYou />;
};

export default SurveyPage;