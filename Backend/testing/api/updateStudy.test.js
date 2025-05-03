import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import nock from "nock";
import { 
  API_BASE, 
  TEST_DATA, 
  setupNock, 
  teardownNock 
} from './test-utils.js';

// Initialize supertest with the base URL
const request = supertest(API_BASE);

// Setup and teardown
before(() => {
  setupNock();
});

after(() => {
  teardownNock();
});

// Tests for Update Study Status API
describe('Update Study Status: PATCH /api/studies/:studyId', () => {
  // Positive test cases
  describe('Positive Cases', () => {
    it('should successfully publish a valid study', async () => {
      // Payload for publishing a study
      const updatePayload = {
        published: true
      };
      
      // Need to provide a study object with id for the test to work with test-utils.js
      // Use TEST_DATA.study from test-utils.js but add the questions array
      const studyWithQuestions = {
        ...TEST_DATA.study,
        questions: [
          {
            _id: '60d21b4667d0d8992e610c91',
            text: 'What is your favorite color?',
            questionType: 'selection',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            isRequired: true
          },
          {
            _id: '60d21b4667d0d8992e610c92',
            text: 'Rate these items from most to least important',
            questionType: 'ranking',
            options: ['Health', 'Wealth', 'Family', 'Career'],
            isRequired: false
          }
        ],
        published: false
      };

      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${studyWithQuestions.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study published successfully',
          study: {
            ...studyWithQuestions,
            published: true
          }
        });
      
      // Make request using supertest
      const response = await request
        .patch(`/api/studies/${studyWithQuestions.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(response.body.study.published, true, 'Study should be marked as published');
    });
    
    it('should successfully unpublish a published study', async () => {
      // Payload for unpublishing a study
      const updatePayload = {
        published: false
      };
      
      // Mock starting with a published study
      const publishedStudy = {
        ...TEST_DATA.study,
        questions: [
          {
            _id: '60d21b4667d0d8992e610c91',
            text: 'What is your favorite color?',
            questionType: 'selection',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            isRequired: true
          },
          {
            _id: '60d21b4667d0d8992e610c92',
            text: 'Rate these items from most to least important',
            questionType: 'ranking',
            options: ['Health', 'Wealth', 'Family', 'Career'],
            isRequired: false
          }
        ],
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${publishedStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study unpublished successfully',
          study: {
            ...publishedStudy,
            published: false
          }
        });
      
      // Make request using supertest
      const response = await request
        .patch(`/api/studies/${publishedStudy.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.message, 'Study unpublished successfully', 'Should return success message');
      assert.strictEqual(response.body.study.published, false, 'Study should be marked as unpublished');
    });
  });
  
  // Negative test cases
  describe('Negative Cases', () => {
    it('should return 401 when no authentication token is provided', async () => {
      // Payload for publishing a study
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${TEST_DATA.study.id}`, updatePayload)
        .reply(401, {
          message: 'Not authorized, no token'
        });
      
      // Make request without authentication
      const response = await request
        .patch(`/api/studies/${TEST_DATA.study.id}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(response.body.message, 'Not authorized, no token', 'Should return auth error message');
    });
    
    it('should return 403 when user is not the creator of the study', async () => {
      // Payload for publishing a study
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${TEST_DATA.study.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.otherUser.token}`)
        .reply(403, {
          message: 'Not authorized, you can only update your own studies'
        });
      
      // Make request with different user token
      const response = await request
        .patch(`/api/studies/${TEST_DATA.study.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.otherUser.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 403, 'Should return 403 Forbidden status');
      assert.strictEqual(response.body.message, 'Not authorized, you can only update your own studies', 'Should return ownership error message');
    });
    
    it('should return 404 when study does not exist', async () => {
      // Payload for publishing a study
      const updatePayload = {
        published: true
      };
      
      // Non-existent study ID
      const nonExistentStudyId = 'non-existent-study';
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${nonExistentStudyId}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(404, {
          message: 'Study not found'
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${nonExistentStudyId}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 404, 'Should return 404 Not Found status');
      assert.strictEqual(response.body.message, 'Study not found', 'Should return study not found message');
    });
    
    it('should return 400 when trying to publish a study with no questions', async () => {
      // Create empty study for this test
      const emptyStudy = {
        id: 'empty-study-id',
        title: 'Empty Study',
        description: 'This study has no questions',
        questions: [],
        published: false,
        creator: TEST_DATA.user.id
      };
      
      // Payload for publishing a study
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${emptyStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(400, {
          message: 'Cannot publish a study with no questions'
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${emptyStudy.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Cannot publish a study with no questions', 'Should return validation error message');
    });
    
    it('should return 400 when published field is missing', async () => {
      // Invalid payload without 'published' field
      const invalidPayload = {
        someOtherField: 'value'
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${TEST_DATA.study.id}`, invalidPayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(400, {
          message: 'Published status is required'
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${TEST_DATA.study.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(invalidPayload);
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Published status is required', 'Should return validation error message');
    });
    
    it('should return 400 when published field is not a boolean', async () => {
      // Invalid payload with non-boolean 'published' field
      const invalidPayload = {
        published: 'yes' // String instead of boolean
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${TEST_DATA.study.id}`, invalidPayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(400, {
          message: 'Published status must be a boolean value'
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${TEST_DATA.study.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(invalidPayload);
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Published status must be a boolean value', 'Should return validation error message');
    });
  });
  
  // Boundary test cases
  describe('Boundary Cases', () => {
    it('should successfully publish a study with exactly one question', async () => {
      // Study with exactly one question
      const studyWithOneQuestion = {
        id: 'one-question-study-id',
        title: 'One Question Study',
        description: 'This study has exactly one question',
        questions: [
          {
            _id: 'one-question-id',
            text: 'What is your favorite color?',
            questionType: 'selection',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            isRequired: true
          }
        ],
        published: false,
        creator: TEST_DATA.user.id
      };
      
      // Payload for publishing
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${studyWithOneQuestion.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study published successfully',
          study: {
            ...studyWithOneQuestion,
            published: true
          }
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${studyWithOneQuestion.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(response.body.study.published, true, 'Study should be marked as published');
      assert.strictEqual(response.body.study.questions.length, 1, 'Study should have exactly one question');
    });
    
    it('should successfully publish a study with all required validation parameters at minimum values', async () => {
      // Study with minimum required fields
      const minimalStudy = {
        id: 'minimal-study-id',
        title: 'Min', // Minimal title
        description: '', // Empty description is allowed
        questions: [
          {
            _id: 'minimal-question-id',
            text: 'Q', // Minimal question text
            questionType: 'text',
            isRequired: false
          }
        ],
        published: false,
        creator: TEST_DATA.user.id
      };
      
      // Payload for publishing
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${minimalStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study published successfully',
          study: {
            ...minimalStudy,
            published: true
          }
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${minimalStudy.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(response.body.study.published, true, 'Study should be marked as published');
    });
  });
  
  // Edge test cases
  describe('Edge Cases', () => {
    it('should handle a study with a large number of questions', async () => {
      // Create a study with 100 questions
      const manyQuestionsStudy = {
        id: 'many-questions-study-id',
        title: 'Many Questions Study',
        description: 'This study has many questions',
        questions: Array(100).fill().map((_, i) => ({
          _id: `question-${i}`,
          text: `Question ${i + 1}`,
          questionType: 'text',
          isRequired: i % 2 === 0 // Alternating required status
        })),
        published: false,
        creator: TEST_DATA.user.id
      };
      
      // Payload for publishing
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${manyQuestionsStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study published successfully',
          study: {
            ...manyQuestionsStudy,
            published: true
          }
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${manyQuestionsStudy.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(response.body.study.published, true, 'Study should be marked as published');
      assert.strictEqual(response.body.study.questions.length, 100, 'Study should have all 100 questions');
    });
    
    it('should handle a study with very long title and description', async () => {
      // Create a study with very long text fields
      const longTextStudy = {
        id: 'long-text-study-id',
        title: 'A'.repeat(500), // Very long title
        description: 'B'.repeat(5000), // Very long description
        questions: [
          {
            _id: 'long-text-question-id',
            text: 'C'.repeat(1000), // Very long question text
            questionType: 'text',
            isRequired: true
          }
        ],
        published: false,
        creator: TEST_DATA.user.id
      };
      
      // Payload for publishing
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${longTextStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study published successfully',
          study: {
            ...longTextStudy,
            published: true
          }
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${longTextStudy.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(response.body.study.published, true, 'Study should be marked as published');
    });
    
    it('should handle republishing an already published study', async () => {
      // Already published study
      const alreadyPublishedStudy = {
        ...TEST_DATA.study,
        questions: [
          {
            _id: 'already-published-question-id',
            text: 'Test question',
            questionType: 'selection',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            isRequired: true
          }
        ],
        published: true
      };
      
      // Payload for publishing
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${alreadyPublishedStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study is already published',
          study: alreadyPublishedStudy
        });
      
      // Make request
      const response = await request
        .patch(`/api/studies/${alreadyPublishedStudy.id}`)
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .send(updatePayload);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.message, 'Study is already published', 'Should return informative message');
      assert.strictEqual(response.body.study.published, true, 'Study should remain published');
    });
  });
});