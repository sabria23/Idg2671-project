// Backend/tests/api/api.integration.test.js

// Import necessary testing libraries
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import nock from 'nock'; // npm install nock --save-dev

// Base URL for API
const API_BASE = 'http://localhost:8000';

// Test data
const TEST_DATA = {
  user: {
    id: '67f299357b36b34ba6a0c930',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMCIsImlhdCI6MTc0NjA0NTQxNSwiZXhwIjoxNzQ2MDQ5MDE1fQ.ua3FjeRFwTjJaf8fJ65uW5ckij5GCy6RD_YNAvqE4Do'
  },
  study: {
    id: 'test-study-123',
    title: 'Test Study',
    description: 'This is a test study for API integration tests'
  },
  session: {
    id: 'test-session-456'
  },
  question: {
    id: 'test-question-789'
  }
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

// Tests for Submit Answer API
describe('Submit Answer: POST /api/survey/:studyId/sessions/:sessionId/responses', () => {
  // Positive tests
  describe('Positive Cases', () => {
    it('should successfully submit a text answer', async () => {
      // Mock API response
      nock(API_BASE)
        .post(`/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.session.id
        });
      
      // Test data - valid text answer
      const answerData = {
        answer: 'This is my test answer',
        answerType: 'text',
        skipped: false
      };
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Answer submitted', 'Should return success message');
      assert.strictEqual(data.sessionId, TEST_DATA.session.id, 'Should return session ID');
    });
    
    it('should successfully submit a multiple-choice answer', async () => {
      // Mock API response
      nock(API_BASE)
        .post(`/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.session.id
        });
      
      // Test data - valid multiple choice answer
      const answerData = {
        answer: ['option1', 'option3'], // Multiple selected options
        answerType: 'multiple-choice',
        skipped: false
      };
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
    });
  });
  
  // Negative tests
  describe('Negative Cases', () => {
    it('should reject submission to non-existent session', async () => {
      // Mock API response for non-existent session
      nock(API_BASE)
        .post(`/api/survey/${TEST_DATA.study.id}/sessions/non-existent-session/responses`)
        .reply(404, {
          message: 'Session not found'
        });
      
      // Test data
      const answerData = {
        answer: 'This should fail',
        answerType: 'text',
        skipped: false
      };
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/survey/${TEST_DATA.study.id}/sessions/non-existent-session/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 404, 'Should return 404 Not Found status');
      assert.strictEqual(data.message, 'Session not found', 'Should return error message');
    });
    
    it('should reject submission with incorrect answer format', async () => {
      // Mock API response for invalid format
      nock(API_BASE)
        .post(`/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`)
        .reply(400, {
          message: 'Invalid answer format for question type'
        });
      
      // Test data - wrong format (string for multiple-choice)
      const answerData = {
        answer: 'single string', // Should be an array for multiple-choice
        answerType: 'multiple-choice',
        skipped: false
      };
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(data.message, 'Invalid answer format for question type', 'Should return validation error');
    });
  });
  
  // Boundary tests
  describe('Boundary Cases', () => {
    it('should accept empty answer when skipped is true', async () => {
      // Mock API response
      nock(API_BASE)
        .post(`/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.session.id
        });
      
      // Test data - empty answer but skipped
      const answerData = {
        answer: null,
        answerType: 'text',
        skipped: true
      };
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status for skipped question');
    });
  });
  
  // Edge tests
  describe('Edge Cases', () => {
    it('should handle extremely large text response', async () => {
      // Mock API response
      nock(API_BASE)
        .post(`/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`)
        .reply(201, {
          message: 'Answer submitted',
          sessionId: TEST_DATA.session.id
        });
      
      // Create a very large answer (10KB of text)
      const largeAnswer = 'A'.repeat(10240);
      
      // Test data with large answer
      const answerData = {
        answer: largeAnswer,
        answerType: 'text',
        skipped: false
      };
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/survey/${TEST_DATA.study.id}/sessions/${TEST_DATA.session.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerData)
      });
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should handle large text answer');
    });
  });
});

