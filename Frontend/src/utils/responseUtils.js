import { getResponses } from "../services/studyService";

// Get count of responses for a study
export const getResponseCount = async (studyId) => {
  try {
    const result = await getResponses(studyId);
    return result.count || 0;
  } catch (error) {
    console.error("Error fetching response count:", error);
    return 0;
  }
};