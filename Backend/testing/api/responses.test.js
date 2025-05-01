/*import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import nock from 'nock';

// Base URL for API
const API_BASE = 'http://localhost:8000';

// Test data - simplified
const TEST_DATA = {
  studyId: '60d21b4667d0d8992e610c90',
  sessionId: '60d21b4667d0d8992e610c95',
  questionId: '60d21b4667d0d8992e610c91'
};

// Setup and teardown
before(() => {
  // Disable real network connections during tests
  nock.disableNetConnect();
  // But allow localhost connections
  nock.enableNetConnect('localhost');
  
  console.log('Nock setup complete - HTTP requests will be intercepted');
});

after(() => {
  // Clean up all nock interceptors
  nock.cleanAll();
  // Re-enable network connections
  nock.enableNetConnect();
  
  console.log('Nock teardown complete - HTTP requests restored');
});

// Tests for Submit Answer endpoint
describe('Submit Answer: POST /api/studies/:studyId/sessions/:sessionId/responses', () => {
  // Positive test cases
  describe('Positive Cases', () => {
    it('should successfully submit a text answer', async () => {
      // Simple answer data
      const answerData = {
        answer: 'This is my text answer',
        skipped: false,
        answerType: 'text'
      };
      
      // Mock the API response
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, answerData)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.sessionId
        });
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Check that the response is as expected
      assert.strictEqual(response.status, 201, 'Should return 201 status code');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
      assert.strictEqual(data.sessionId, TEST_DATA.sessionId, 'Should return the session ID');
    });
    
    it('should successfully submit when marking a question as skipped', async () => {
      // Skipped answer data
      const answerData = {
        answer: null,
        skipped: true,
        answerType: 'selection'
      };
      
      // Mock the API response
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, answerData)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.sessionId
        });
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Check that the response is as expected
      assert.strictEqual(response.status, 201, 'Should return 201 status code');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
  });
  
  // Negative test cases
  describe('Negative Cases', () => {
    it('should return 404 when session is not found', async () => {
      // Answer data
      const answerData = {
        answer: 'My answer',
        skipped: false,
        answerType: 'text'
      };
      
      // Non-existent session ID
      const nonExistentSessionId = 'non-existent-session';
      
      // Mock the API response
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.studyId}/sessions/${nonExistentSessionId}/responses/${TEST_DATA.questionId}`, answerData)
        .reply(404, {
          message: 'Session not found'
        });
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.studyId}/sessions/${nonExistentSessionId}/responses/${TEST_DATA.questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Check that the response is as expected
      assert.strictEqual(response.status, 404, 'Should return 404 status code');
      assert.strictEqual(data.message, 'Session not found', 'Should return session not found message');
    });
  });
  
  // Boundary test cases - testing edge values that are at the limits of acceptable input
  describe('Boundary Cases', () => {
    it('should handle the transition between skipped and not skipped answers', async () => {
      // Testing boundary between skipped/not skipped with a blank answer
      const answerData = {
        answer: "", // Empty string (not null, but no content)
        skipped: false, // Not officially skipped, just empty
        answerType: 'text'
      };
      
      // Mock the API response
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, answerData)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.sessionId
        });
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Check that the response is as expected
      assert.strictEqual(response.status, 201, 'Should return 201 status code');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should accept single selection from multiple choices', async () => {
      // Testing boundary case with single selection
      const answerData = {
        answer: "Option1", // Just one option selected
        skipped: false,
        answerType: 'selection'
      };
      
      // Mock the API response
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, answerData)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.sessionId
        });
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Check that the response is as expected
      assert.strictEqual(response.status, 201, 'Should return 201 status code');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
  });
  
  // Edge test cases
  describe('Edge Cases', () => {
    it('should handle very long text answers', async () => {
      // Edge case - very long answer
      const answerData = {
        answer: 'A'.repeat(5000), // 5000 character answer
        skipped: false,
        answerType: 'text'
      };
      
      // Mock the API response
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, answerData)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.sessionId
        });
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Check that the response is as expected
      assert.strictEqual(response.status, 201, 'Should return 201 status code');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
  });
});*/

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { 
  API_BASE, 
  TEST_DATA, 
  setupNock, 
  teardownNock,
  mockApiResponses 
} from './test-utils.js';

// Setup and teardown
before(() => {
  setupNock();
});

after(() => {
  teardownNock();
});

// Base endpoint for this API
const getEndpoint = (studyId, sessionId, questionId) => 
  `/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`;

// Tests for Submit Answer API
describe('Submit Answer: POST /api/studies/:studyId/sessions/:sessionId/responses/:questionId', () => {
  // Positive tests
  describe('Positive Cases', () => {
    it('should successfully submit a selection type answer', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response
      mockApiResponses.postSuccess(
        getEndpoint(studyId, sessionId, questionId),
        answer,
        {
          message: 'Answer submitted',
          sessionId: sessionId
        },
        201
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
      assert.strictEqual(data.sessionId, sessionId, 'Should return session ID');
    });
    
    it('should successfully submit a numeric type answer', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[2]._id;
      const answer = TEST_DATA.answers.numeric;
      
      // Mock API response
      mockApiResponses.postSuccess(
        getEndpoint(studyId, sessionId, questionId),
        answer,
        {
          message: 'Answer submitted',
          sessionId: sessionId
        },
        201
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should successfully mark a question as skipped', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[3]._id;
      const answer = TEST_DATA.answers.skipped;
      
      // Mock API response
      mockApiResponses.postSuccess(
        getEndpoint(studyId, sessionId, questionId),
        answer,
        {
          message: 'Answer submitted',
          sessionId: sessionId
        },
        201
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
  });
  
  // Negative tests
  describe('Negative Cases', () => {
    it('should return 404 when session is not found', async () => {
      const studyId = TEST_DATA.study.id;
      const nonExistentSessionId = 'non-existent-session';
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response
      mockApiResponses.postNotFound(
        getEndpoint(studyId, nonExistentSessionId, questionId),
        answer
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, nonExistentSessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 404, 'Should return 404 Not Found status');
      assert.strictEqual(data.message, 'Resource not found', 'Should return not found message');
    });
    
    it('should return 404 when study is not found', async () => {
      const nonExistentStudyId = 'non-existent-study';
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response
      mockApiResponses.postNotFound(
        getEndpoint(nonExistentStudyId, sessionId, questionId),
        answer
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(nonExistentStudyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 404, 'Should return 404 Not Found status');
      assert.strictEqual(data.message, 'Resource not found', 'Should return not found message');
    });
    
    it('should return 400 when question is not found in the study', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const nonExistentQuestionId = 'non-existent-question';
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response
      mockApiResponses.postBadRequest(
        getEndpoint(studyId, sessionId, nonExistentQuestionId),
        answer,
        'Question not found in this study'
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, nonExistentQuestionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(data.message, 'Question not found in this study', 'Should return question not found message');
    });
    
    it('should return 409 when answer already exists for the question', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.sessionWithResponses.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response
      mockApiResponses.postConflict(
        getEndpoint(studyId, sessionId, questionId),
        answer
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 409, 'Should return 409 Conflict status');
      assert.strictEqual(data.message, 'Conflict', 'Should return conflict message');
    });
    
    it('should handle server errors gracefully', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response
      mockApiResponses.postServerError(
        getEndpoint(studyId, sessionId, questionId),
        answer
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 500, 'Should return 500 Internal Server Error status');
      assert.strictEqual(data.message, 'Internal server error', 'Should return server error message');
    });
  });
  
  // Boundary tests
  describe('Boundary Cases', () => {
    it('should accept a numeric answer at the lower boundary (0)', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[2]._id;
      const boundaryAnswer = {
        answer: 0,
        answerType: 'numeric',
        skipped: false
      };
      
      // Mock API response
      mockApiResponses.postSuccess(
        getEndpoint(studyId, sessionId, questionId),
        boundaryAnswer,
        {
          message: 'Answer submitted',
          sessionId: sessionId
        },
        201
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(boundaryAnswer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should accept a numeric answer at the upper boundary (130)', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[2]._id;
      const boundaryAnswer = {
        answer: 130,
        answerType: 'numeric',
        skipped: false
      };
      
      // Mock API response
      mockApiResponses.postSuccess(
        getEndpoint(studyId, sessionId, questionId),
        boundaryAnswer,
        {
          message: 'Answer submitted',
          sessionId: sessionId
        },
        201
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(boundaryAnswer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
  });
  
  // Edge tests
  describe('Edge Cases', () => {
    it('should handle very long text responses', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[3]._id;
      const longAnswer = {
        answer: 'A'.repeat(10000), // Very long text answer
        answerType: 'text',
        skipped: false
      };
      
      // Mock API response
      mockApiResponses.postSuccess(
        getEndpoint(studyId, sessionId, questionId),
        longAnswer,
        {
          message: 'Answer submitted',
          sessionId: sessionId
        },
        201
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(longAnswer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should handle submission with minimal required fields', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const minimalAnswer = {
        answerType: 'selection',
        skipped: true
      };
      
      // Mock API response
      mockApiResponses.postSuccess(
        getEndpoint(studyId, sessionId, questionId),
        minimalAnswer,
        {
          message: 'Answer submitted',
          sessionId: sessionId
        },
        201
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(minimalAnswer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should reject invalid answer type', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const invalidAnswer = {
        answer: 'Red',
        answerType: 'invalid_type', // Invalid answer type
        skipped: false
      };
      
      // Mock API response
      mockApiResponses.postBadRequest(
        getEndpoint(studyId, sessionId, questionId),
        invalidAnswer,
        'Invalid answer type'
      );
      
      // Make request
      const response = await fetch(`${API_BASE}${getEndpoint(studyId, sessionId, questionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidAnswer)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(data.message, 'Invalid answer type', 'Should return invalid answer type message');
    });
  });
});


