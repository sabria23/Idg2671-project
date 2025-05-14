import axios from 'axios';

export const submitDemographics = async (studyId, sessionId, demographics) => {
  if (!studyId || !sessionId || !demographics) {
    console.error("Missing required values for demographics update");
    return false;
  }

  try {
    const response = await axios.patch(`/api/survey/${studyId}/sessions/${sessionId}`, {
      demographics
    });

    return response.status === 200;
  } catch (error) {
    console.error("Submission failed:", error);
    return null;
  }
};
