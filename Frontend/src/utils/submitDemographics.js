import axios from 'axios';
import { UAParser } from 'ua-parser-js';

export const submitDemographics = async (studyId, demographics) => {
  // Ensure required fields exist
  console.log("[DEBUG] studyId:", studyId);
console.log("[DEBUG] demographics:", demographics);

  if (
    !studyId ||
    !demographics ||
    !demographics.age ||
    isNaN(Number(demographics.age)) ||
    !demographics.gender
  ) {
    console.error("Invalid demographics input");
    return null;
  }

  try {
    const parser = new UAParser();
    const ua = parser.getResult();
    const deviceInfo = `${ua.browser.name || 'Unknown Browser'} on ${ua.os.name || 'Unknown OS'}`;

    console.log("Submitting demographics payload:", { deviceInfo, demographics });

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
