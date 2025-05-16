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

  // Steps: 0 = Intro, 1 = Demographics, 2..Q+1 = Questions, Q+2 = Thanks
  const [currentStep, setCurrentStep]       = useState(0);
  const [studyInfo, setStudyInfo]           = useState(null);
  const [demographics, setDemographics]     = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [sessionId, setSessionId]           = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [demographicsConfig, setDemographicsConfig] = useState({
    enabled : false,
    fields  : []
  });

  // Map UI question types to DB answer types
  const answerTypeMap = {
    'open-ended'      : 'text',
    'multiple-choice' : 'selection',
    'checkbox'        : 'selection',
    'thumbs-up-down'  : 'selection',
    'numeric-rating'  : 'numeric',
    'star-rating'     : 'numeric',
    'emoji-rating'    : 'numeric',
    'label-slider'    : 'numeric'
  };

  // responseId cache so we PATCH when the user edits an answer
  const responseMap = useRef({});

  // 1) Fetch study meta (page 0) – always contains demographicsConfig
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(
          `/api/survey/${studyId}`,
          { params: { page: 0, preview: isPreview } }
        );

        const {
          title,
          description,
          totalQuestions: tq,
          demographics,
          demographicsConfig
        } = res.data;

        setStudyInfo({ title, description });
        setTotalQuestions(tq);
        setDemographicsConfig(
          demographicsConfig ?? demographics ?? { enabled: false, fields: [] }
        );
      } catch (err) {
        console.error('Failed to load study metadata', err);
      }
    };

    fetchMeta();
  }, [studyId, isPreview]);

  // 2)  Session bookkeeping / resume
  useEffect(() => {
    if (totalQuestions == null) return;

    // Preview jumps straight to questions, no session
    if (isPreview) {
      setCurrentStep(2);
      return;
    }

    // Already completed on this device
    if (localStorage.getItem(`survey-completed-${studyId}`) === 'true') {
      setCurrentStep(totalQuestions + 2);
      return;
    }

    // Resume unfinished session
    const storedSid  = localStorage.getItem(`survey-session-${studyId}`);
    const storedStep = localStorage.getItem(`survey-step-${studyId}`);

    if (storedSid) {
      setSessionId(storedSid);
      const stepNum = parseInt(storedStep, 10);
      if (!isNaN(stepNum) && stepNum >= 2 && stepNum <= totalQuestions + 1) {
        setCurrentStep(stepNum);
        return;
      }
    }

    // Fresh run
    setCurrentStep(0);
  }, [isPreview, studyId, totalQuestions]);

  // 3) Fetch question for the current page (only when needed)
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

  // 4)  Persist session + step in localStorage (only live mode)
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

  // 5)  Handlers
  const handleStart = async () => {
    if (isPreview) {
      setCurrentStep(2);
      return;
    }

    // If demographics collection is disabled we can skip that step
    if (!demographicsConfig.enabled) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }

    // Create session only the first time the user hits "Start"
    if (sessionId) return;

    try {
      const parser = new UAParser();
      const info   = parser.getResult();
      const deviceInfo = `${info.browser.name || 'Browser'} on ${info.os.name || 'OS'}`;

      const res = await axios.post(`/api/survey/${studyId}/sessions`, { deviceInfo });
      setSessionId(res.data.sessionId);
    } catch (err) {
      console.error('Failed to start session', err);
      alert('Could not start session. Please try again.');
    }
  };

  const handleDemographics = async (answers) => {
    if (isPreview) {
      setCurrentStep(2);
      return;
    }

    try {
      await axios.post(
        `/api/survey/${studyId}/sessions/${sessionId}/demographics`,
        answers
      );
      setDemographics(answers);
      setCurrentStep(2);
    } catch (err) {
      console.error('Failed to submit demographics', err);
      alert('Could not save demographics. Please try again.');
    }
  };

  const handleAnswerSubmit = async (answer, skipped = false) => {
    if (isPreview) return;

    const qid        = currentQuestion._id;
    const answerType = answerTypeMap[currentQuestion.questionType] || 'text';
    const existing   = responseMap.current[qid];

    try {
      if (existing && existing !== 'pending') {
        await axios.patch(
          `/api/survey/${studyId}/sessions/${sessionId}/responses/${existing}`,
          { participantAnswer: skipped ? null : answer, skipped, answerType }
        );
      } else {
        responseMap.current[qid] = 'pending';
        const res = await axios.post(
          `/api/survey/${studyId}/sessions/${sessionId}/responses`,
          { questionId: qid, participantAnswer: skipped ? null : answer, skipped, answerType }
        );
        responseMap.current[qid] = res.data.responseId;
      }
    } catch (err) {
      console.error('Failed to submit answer', err);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 2) setCurrentStep(s => s - 1);
  };

  const handleNext = () => {
    if (currentStep === totalQuestions + 1) {
      localStorage.setItem(`survey-completed-${studyId}`, 'true');
    }
    
    // If the the participant is on the last question then we will send a request to the backend to complete the session
    if (!isPreview && currentStep === totalQuestions + 1) {
      axios.patch(`/api/survey/${studyId}/sessions/${sessionId}/complete`)
        .catch(err => console.error('Failed to complete session', err));
    }
    setCurrentStep(s => s + 1);
  };

  // 6)  Render according to step
 
  if (currentStep === 0) {
    return (
      <SurveyIntro
        studyInfo={studyInfo}
        isPreview={isPreview}
        totalQuestions={totalQuestions}
        onStart={handleStart}
      />
    );
  }

  if (currentStep === 1) {
    return (
      <SurveyDemographics
        studyId={studyId}
        sessionId={sessionId}
        demographicsConfig={demographicsConfig}
        onSubmit={handleDemographics}
        onBack={() => setCurrentStep(0)}
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
