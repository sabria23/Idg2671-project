import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import UAParser from 'ua-parser-js';
import axios from 'axios';
import '../../styles/displaySurvey.css';

// IMPORTANT! Code should be splitted to components and have buttons for next and back!

// make props for the page if it should be the real thing or a preview
// a mode='preview' and a mode='live', preview will be accessible from the createStudy page and live from the link
export default function surveyPage({ mode = 'live' }) {
    const {studyId} = useParams(); 
    const isPreview = mode === 'preview'; // Check if the page is in preview mode





    const [step, setStep] = useState(0) // For managing the steps of the study 0 = intro, 1 = Demographics, 3 questions, 4 = submission and thank you
    const [studyInfo, setStudyInfo] = useState(null); // For title and description of the study

    // UseState to manage the demographics info and the session status to separate preview and live
    const [demographics, setDemographics] = useState({age:'', gender:''});
    const [sessionId, setSessionId] = useState(null);

    const [currentQuestion, setCurrentQuestion] = useState(null); 
    const [totalQuestions, setTotalQuestions] = useState(0); 
    const [selectedOption, setSelectedOption] = useState(''); // For managing the selected option in the question
    const [navDirection, setNavDirection] = useState('forward');

    // FAKE PREVIEW PAGE
    if (isPreview) {
        // Step 0 – Intro
        if (step === 0) {
          return (
            <div>
              <h1>Visual Comparison of AI-Generated Cats</h1>
              <p>
                Welcome! This preview simulates what participants will experience during the study.
                They will compare cat images generated by AI and provide feedback.
              </p>
              <button onClick={() => setStep(1)}>Start</button>
            </div>
          );
        }
      
        // Step 1 – Demographics
        if (step === 1) {
          return (
            <div>
              <h2>Demographics (Preview)</h2>
              <label>Age:</label>
              <select disabled><option>18–25</option></select>
              <label>Gender:</label>
              <select disabled><option>Prefer not to say</option></select>
              <button onClick={() => setStep(2)}>Next</button>
            </div>
          );
        }
      
        // Step 2 – Static Question 1
        if (step === 2) {
          return (
            <div>
              <h3>Question 1: Which cat looks more realistic?</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <img src="/preview/cat1.jpg" alt="Cat 1" width="200" />
                <img src="/preview/cat2.jpg" alt="Cat 2" width="200" />
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>🔘 Cat 1</li>
                <li>🔘 Cat 2</li>
              </ul>
              <div>
                <button onClick={() => setStep(1)}>Back</button>
                <button onClick={() => setStep(3)}>Next</button>
              </div>
            </div>
          );
        }
      
        // Step 3 – Static Question 2
        if (step === 3) {
          return (
            <div>
              <h3>Question 2: Describe the cat's expression</h3>
              <img src="/preview/cat3.jpg" alt="Cat 3" width="200" />
              <textarea disabled value="(Open-ended input is disabled in preview)" rows="3" cols="50" />
              <div>
                <button onClick={() => setStep(2)}>Back</button>
                <button onClick={() => setStep(4)}>Finish</button>
              </div>
            </div>
          );
        }
      
        // Step 4 – Final thank you page
        if (step === 4) {
          return (
            <div>
              <h1>🎉 Thank You!</h1>
              <p>This concludes the preview. No data has been recorded.</p>
              <button onClick={() => setStep(0)}>Restart Preview</button>
            </div>
          );
        }
      }
      




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
            const url = isPreview
                ? `/api/survey/${studyId}/questions/${page}`
                : `/api/survey/${studyId}/questions/${page}&sessionId=${sessionId}`;
            const res = await axios.get(url);
            setCurrentQuestion(res.data.question);
            setTotalQuestions(res.data.totalQuestions);

            if (navDirection === 'back' && res.data.previousAnswer) {
                setSelectedOption(res.data.previousAnswer);
            } else {
                selectedOption('');
            }
        };

        if (step >= 2 && (sessionId || isPreview)) {
            fetchQuestion();        
        }
    }, [step, studyId, sessionId, isPreview]);

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
        const parser = new UAParser();
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
        const isSkipped = !selectedOption;
        setNavDirection('forward');

        if(isPreview) {
            setStep(prev => prev + 1);
            setSelectedOption('');
            return;
        }

        try {
            await axios.post(`/api/survey/${studyId}/sessions/${sessionId}/${questionId}`, {
                participantAnswer: isSkipped ? null : submitAnswer,
                skipped: isSkipped,
                answerType: currentQuestion.questionType
            });
            
        } catch (err) {
            if (err.response?.status === 409) {
                await axios.put(`/api/survey/${studyId}/sessions/${sessionId}/${questionId}`, {
                    participantAnswer: isSkipped ? null : submitAnswer,
                    skipped: isSkipped,
                    answerType: currentQuestion.questionType
                });
            }
        }
        setSelectedOption('');
        setStep(prev => prev + 1)
    }

    const handleBack = () => {
        if (step > 2) {
            setNavDirection('back')
            setStep(prev => prev - 1); 
        }
    };


    // STEP 3 - SUBMISSION AND THANK YOU
    // WIP

    if (!studyInfo) {
        return <div>Loading...</div>
    }


    if (step === 0) {
        return (
            <div>
                <h1>{studyInfo.title}</h1>
                <p>{studyInfo.description}</p>
                <button onClick={handleStart}>Start</button>
            </div>
        )
    }

    // !IMPORTANT! prefer not to say should maybe be otheroption instead
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

    // Check if all of the questions have been answered and complete the session
    // add completed logic!
    if (step >= 2 && step - 2 >= totalQuestions) {
        return (
            <div>
                <h1>Thank you for your participation!</h1>
                <p>Your responses have been submitted.</p>
            </div>
        );
    }

    // Question display logic INCOMPLETE
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
                </div>
                <button onClick={handleBack}>Back</button>
                <button onClick={handleAnswer}>Next</button>
            </div>
        )
    }

return null;

}