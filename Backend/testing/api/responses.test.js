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

const request = supertest(API_BASE);

// Setup and teardown od db
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
      
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(201, {
          message: 'Answer submitted', 
          sessionId: sessionId
        });

      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
      assert.strictEqual(response.body.sessionId, sessionId, 'Should return session ID');
    });
    
    it('should return 201 Created when submitting valid numeric answer', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[2]._id;
      const answer = TEST_DATA.answers.numeric;

      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
    });
    
    it('should return 201 Created when marking a question as skipped', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[3]._id;
      const answer = TEST_DATA.answers.skipped;
      
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
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
      
      nock(API_BASE)
        .post(`/api/studies/${nonExistentStudyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(404, {
          message: 'Resource not found'
        });

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
      
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${nonExistentQuestionId}`, answer)
        .reply(400, {
          message: 'Question not found in this study'
        });
      
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${nonExistentQuestionId}`)
        .send(answer);
      
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Question not found in this study', 'Should return question not found message');
    });
 
    it('should return 500 Internal Server Error when server encounters an exception', async () => {
      const studyId = TEST_DATA.study.id;
      const sessionId = TEST_DATA.session.id;
      const questionId = TEST_DATA.study.questions[0]._id;
      const answer = TEST_DATA.answers.selection;

      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, answer)
        .reply(500, {
          message: 'Internal server error'
        });
      
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(answer);
      
      assert.strictEqual(response.status, 500, 'Should return 500 Internal Server Error status');
      assert.strictEqual(response.body.message, 'Internal server error', 'Should return server error message');
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
      
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, invalidAnswer)
        .reply(400, {
          message: 'Invalid answer type'
        });
      
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(invalidAnswer);
      
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Invalid answer type', 'Should return invalid answer type message');
    });
  });
  
  // Boundary tests
  describe('Boundary Cases', () => {
    it('should handle the transition between skipped and not skipped answers', async () => {
      // Testing boundary between skipped/not skipped with a blank answer
    const answerData = {
      answer: "", // Empty string (not null, but no content)
      skipped: false, // Not officially skipped, just empty
      answerType: 'text'
    };
    
    nock(API_BASE)
      .post(`/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`, answerData)
      .reply(201, {
        message: 'Answer submitted',
        sessionId: TEST_DATA.sessionId
      });
    
    const response = await request
      .post(`/api/studies/${TEST_DATA.studyId}/sessions/${TEST_DATA.sessionId}/responses/${TEST_DATA.questionId}`)
      .send(answerData);  // Send the request data
     
      assert.strictEqual(response.status, 201, 'Should return 201 status code');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
    });
    
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
      
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, longAnswer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(longAnswer);
      
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
      
      nock(API_BASE)
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`, minimalAnswer)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: sessionId
        });
      
      const response = await request
        .post(`/api/studies/${studyId}/sessions/${sessionId}/responses/${questionId}`)
        .send(minimalAnswer);
    
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.message, 'Answer submitted', 'Should return success message');
    });
  });
});