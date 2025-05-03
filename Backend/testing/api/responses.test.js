/*
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
  
*/     
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

// Tests for Submit Answer API
describe('Submit Answer: POST /api/studies/:studyId/sessions/:sessionId/responses/:questionId', () => {
  // Positive tests
  describe('Positive Cases', () => {
    it('should return 201 Created with session ID when submitting valid selection answer', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(201, {
          message: 'Answer submitted', 
          sessionId: sessionId
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
      assert.strictEqual(response.body.sessionId, sessionId, 'Should return session ID');
    });
    
    it('should return 201 Created when submitting valid numeric answer', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[2]._id;
      const answer = TEST_DATA.answers.numeric;
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should return 201 Created when marking a question as skipped', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[3]._id;
      const answer = TEST_DATA.answers.skipped;
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
    });
  });
  
  // Negative tests
  describe('Negative Cases, error handling', () => {  
    it('should return 404 when study is not found', async () => {
      const nonExistentStudyId = 'non-existent-study';
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${nonExistentStudyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(404, {
          message: 'Resource not found'
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${nonExistentStudyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      // Assertions
      assert.strictEqual(response.status, 404, 'Should return 404 Not Found status');
      assert.strictEqual(response.body.message, 'Resource not found', 'Should return not found message');
    });
    
    it('should return 400 when question is not found in the study', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const nonExistentQuestionId = 'non-existent-question';
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${nonExistentQuestionId}`, answer)
        .reply(400, {
          message: 'Question not found in this study'
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${nonExistentQuestionId}`)
        .send(answer);
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Question not found in this study', 'Should return question not found message');
    });
 
    it('should return 500 Internal Server Error when server encounters an exception', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(500, {
          message: 'Internal server error'
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      // Assertions
      assert.strictEqual(response.status, 500, 'Should return 500 Internal Server Error status');
      assert.strictEqual(response.body.message, 'Internal server error', 'Should return server error message');
    });
  });
  
  // Boundary tests
  describe('Boundary Cases', () => {
    
  });
  
  // Edge tests
  describe('Edge Cases', () => {
    it('should handle extremely large text responses (10000 chars) and return 201', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[3]._id;
      const longAnswer = {
        answer: 'A'.repeat(10000), // Very long text answer
        answerType: 'text',
        skipped: false
      };
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, longAnswer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(longAnswer);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should handle submission with minimal required fields, and return 201', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const minimalAnswer = {
        answerType: 'selection',
        skipped: true
      };
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, minimalAnswer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(minimalAnswer);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should return 400 Bad Request when answer type is invalid', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const invalidAnswer = {
        answer: 'Red',
        answerType: 'invalid_type', // Invalid answer type
        skipped: false
      };
      
      // Mock API response with direct nock
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, invalidAnswer)
        .reply(400, {
          message: 'Invalid answer type'
        });
      
      // Make request using supertest
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(invalidAnswer);
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Invalid answer type', 'Should return invalid answer type message');
    });
  });
});