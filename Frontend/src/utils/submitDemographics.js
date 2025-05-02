import axios from 'axios';
import { UAParser } from 'ua-parser-js';

export const submitDemographics = async (studyId, demographics) => {
  // Ensure required fields exist
  if (!studyId || !demographics || !demographics.age || !demographics.gender) {
    console.error("Missing studyId or demographics");
    return null;
  }

  try {
    const parser = new UAParser();
    const ua = parser.getResult();
    const deviceInfo = `${ua.browser.name || 'Unknown Browser'} on ${ua.os.name || 'Unknown OS'}`;

    const response = await axios.post(`/api/survey/${studyId}/sessions`, {
      deviceInfo,
      demographics
    });

    return response.data.sessionId;
  } catch (error) {
    console.error("Submission failed:", error);
    return null;
  }
};
