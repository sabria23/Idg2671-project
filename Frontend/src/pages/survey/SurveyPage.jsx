import { useState } from 'react'
import { useParams } from 'react-router-dom';
import UAParser from 'ua-parser-js';
import axios from 'axios';
import '../styles/displaySurvey.css';

// make props for the page if it should be the real thing or a preview
// a mode='preview' and a mode='live', preview will be accessible from the createStudy page and live from the link


const {studyId} = useParams();
const [step, setStep] = useState(0) // For managing the steps of the study 0 = intro, 1 = Demographics, 3

// UseState to manage the demographics info and the session status to separate preview and live
const [demographics, setDemographics] = useState({age:'', gender:''});
const [hasSessionStarted, setHasSessionStarted] = useState(false);
const [sessionId, setSessionId] = useState(null);


// UAParser to get the device information
const parser = new UAParser();
const result = parser.getResult();
const browser = result.browser.name || 'Unknown browser';
const os = result.os.name || 'Unknown os';

const deviceInfo = `${browser} on ${os}`;

// Function that starts the session when the user delivers the demographics info at the start of the survey
const startSession = async () => {
    const res = await axios.post('/api/survey/${studyId}/sessions', {
        deviceInfo: navigator.userAgent,
        demographics
    });
    setSessionId(res.data.sessionId);
    setHasSessionStarted(true);
};

return (
    <>

    </>
);
export default surveyPage;
