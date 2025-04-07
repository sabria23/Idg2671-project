import {useState} from 'react'
import axios from 'axios';
import 'surveyPage.css'
// make props for the page if it should be the real thing or a preview
// a mode='preview' and a mode='live', preview will be accessible from the createStudy page and live from the link

// UseState to manage the demographics info and the session status to separate preview and live
const [demographics, setDemographics] = useState({age:'', gender:''});
const [hasSessionStarted, setHasSessionStarted] = useState(false);

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
