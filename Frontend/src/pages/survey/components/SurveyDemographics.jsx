/*For the participant-facing survey, you'll need new components that:
1. Read the demographics settings from the Study model
2. Display the appropriate demographics form to participants
3. Collect and save responses to the Session model

Yes, that's exactly right! Here's a summary of the changes you need to make:

1. **Add a new route in surveyRoute.js**:
   ```javascript
   router.post('/:studyId/sessions/:sessionId/demographics', saveDemographicsData);
   ```

2. **Create a controller function called `saveDemographicsData`**:
   This function will:
   - Get the session by ID
   - Convert the incoming demographics data to a Map
   - Save it to the session's demographics field
   - Return success

3. **Update the `getStudy` controller**:
   Modify it to include demographics configuration in its response:
   ```javascript
   res.json({
     title: study.title,
     description: study.description,
     totalQuestions: study.questions.length,
     demographics: study.demographics // Include demographics configuration
   });
   ```

4. **In the SurveyDemographics component**:
   - Fetch the study data which now includes demographics configuration
   - Check if demographics.enabled is true
   - If true, render the demographics form based on demographics.fields
   - If false, skip directly to questions

These changes will allow:
- The SurveyDemographics component to dynamically render form fields based on the researcher's configuration
- Participants to submit their demographics data
- The system to store that data in the Session model using a Map structure

You already have routes for researchers to configure demographics, so this completes the implementation by adding the participant-facing functionality.
*/