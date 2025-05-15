import axios from 'axios';

export const submitDemographics = async (studyId, sessionId, demographicsData) => {
  try {
    console.log('Submitting demographics:', { studyId, sessionId, demographicsData });
    
    // Make a POST request to the demographics endpoint
    const response = await axios.post(
      `/api/survey/${studyId}/sessions/${sessionId}/demographics`, 
      demographicsData
    );
    
    console.log('Demographics submission successful:', response.data);
    return true;
  } catch (error) {
    console.error('Submission failed:', error);
    return false;
  }
};
