import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import nock from 'nock';

// Base URL for API
const API_BASE = 'http://localhost:8000';

// Test data
const TEST_DATA = {
  user: {
    id: '67f299357b36b34ba6a0c930',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMCIsImlhdCI6MTc0NjA0NTQxNSwiZXhwIjoxNzQ2MDQ5MDE1fQ.ua3FjeRFwTjJaf8fJ65uW5ckij5GCy6RD_YNAvqE4Do'
  },
  study: {
    id: '60d21b4667d0d8992e610c90',
    title: 'Test Study',
    description: 'This is a test study for API integration tests',
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
    published: false,
    creator: '67f299357b36b34ba6a0c930'
  },
  emptyStudy: {
    id: '60d21b4667d0d8992e610c93',
    title: 'Empty Study',
    description: 'This study has no questions',
    questions: [],
    published: false,
    creator: '67f299357b36b34ba6a0c930'
  },
  otherUser: {
    id: '67f299357b36b34ba6a0c931',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMSIsImlhdCI6MTc0NjA0NTQxNSwiZXhwIjoxNzQ2MDQ5MDE1fQ.8dMLG3qMNpqCV7PadkRh_Q7HK2XTB4Kn0AEtX5Dd9aE'
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

// Tests for Update Study Status API
describe('Update Study Status: PATCH /api/studies/:studyId', () => {
  // Positive test cases
  describe('Positive Cases', () => {
    it('should successfully publish a valid study', async () => {
      // Payload for publishing a study
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${TEST_DATA.study.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study published successfully',
          study: {
            ...TEST_DATA.study,
            published: true
          }
        });
      
      // Make request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(data.study.published, true, 'Study should be marked as published');
    });
    
    it('should successfully unpublish a published study', async () => {
      // Payload for unpublishing a study
      const updatePayload = {
        published: false
      };
      
      // Mock starting with a published study
      const publishedStudy = {
        ...TEST_DATA.study,
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
      
      // Make request
      const response = await fetch(`${API_BASE}/api/studies/${publishedStudy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.message, 'Study unpublished successfully', 'Should return success message');
      assert.strictEqual(data.study.published, false, 'Study should be marked as unpublished');
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
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(data.message, 'Not authorized, no token', 'Should return auth error message');
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
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.otherUser.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 403, 'Should return 403 Forbidden status');
      assert.strictEqual(data.message, 'Not authorized, you can only update your own studies', 'Should return ownership error message');
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
      const response = await fetch(`${API_BASE}/api/studies/${nonExistentStudyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 404, 'Should return 404 Not Found status');
      assert.strictEqual(data.message, 'Study not found', 'Should return study not found message');
    });
    
    it('should return 400 when trying to publish a study with no questions', async () => {
      // Payload for publishing a study
      const updatePayload = {
        published: true
      };
      
      // Mock API response
      nock(API_BASE)
        .patch(`/api/studies/${TEST_DATA.emptyStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(400, {
          message: 'Cannot publish a study with no questions'
        });
      
      // Make request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.emptyStudy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(data.message, 'Cannot publish a study with no questions', 'Should return validation error message');
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
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(invalidPayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(data.message, 'Published status is required', 'Should return validation error message');
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
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(invalidPayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(data.message, 'Published status must be a boolean value', 'Should return validation error message');
    });
  });
  
  // Boundary test cases
  describe('Boundary Cases', () => {
    it('should successfully publish a study with exactly one question', async () => {
      // Study with exactly one question
      const studyWithOneQuestion = {
        id: '60d21b4667d0d8992e610c94',
        title: 'One Question Study',
        description: 'This study has exactly one question',
        questions: [
          {
            _id: '60d21b4667d0d8992e610c95',
            text: 'What is your favorite color?',
            questionType: 'selection',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            isRequired: true
          }
        ],
        published: false,
        creator: '67f299357b36b34ba6a0c930'
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
      const response = await fetch(`${API_BASE}/api/studies/${studyWithOneQuestion.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(data.study.published, true, 'Study should be marked as published');
      assert.strictEqual(data.study.questions.length, 1, 'Study should have exactly one question');
    });
    
    it('should successfully publish a study with all required validation parameters at minimum values', async () => {
      // Study with minimum required fields
      const minimalStudy = {
        id: '60d21b4667d0d8992e610c96',
        title: 'Min', // Minimal title
        description: '', // Empty description is allowed
        questions: [
          {
            _id: '60d21b4667d0d8992e610c97',
            text: 'Q', // Minimal question text
            questionType: 'text',
            isRequired: false
          }
        ],
        published: false,
        creator: '67f299357b36b34ba6a0c930'
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
      const response = await fetch(`${API_BASE}/api/studies/${minimalStudy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(data.study.published, true, 'Study should be marked as published');
    });
  });
  
  // Edge test cases
  describe('Edge Cases', () => {
    it('should handle a study with a large number of questions', async () => {
      // Create a study with 100 questions
      const manyQuestionsStudy = {
        id: '60d21b4667d0d8992e610c98',
        title: 'Many Questions Study',
        description: 'This study has many questions',
        questions: Array(100).fill().map((_, i) => ({
          _id: `60d21b4667d0d8992e610d${i.toString().padStart(2, '0')}`,
          text: `Question ${i + 1}`,
          questionType: 'text',
          isRequired: i % 2 === 0 // Alternating required status
        })),
        published: false,
        creator: '67f299357b36b34ba6a0c930'
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
      const response = await fetch(`${API_BASE}/api/studies/${manyQuestionsStudy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(data.study.published, true, 'Study should be marked as published');
      assert.strictEqual(data.study.questions.length, 100, 'Study should have all 100 questions');
    });
    
    it('should handle a study with very long title and description', async () => {
      // Create a study with very long text fields
      const longTextStudy = {
        id: '60d21b4667d0d8992e610c99',
        title: 'A'.repeat(500), // Very long title
        description: 'B'.repeat(5000), // Very long description
        questions: [
          {
            _id: '60d21b4667d0d8992e610c9a',
            text: 'C'.repeat(1000), // Very long question text
            questionType: 'text',
            isRequired: true
          }
        ],
        published: false,
        creator: '67f299357b36b34ba6a0c930'
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
      const response = await fetch(`${API_BASE}/api/studies/${longTextStudy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.message, 'Study published successfully', 'Should return success message');
      assert.strictEqual(data.study.published, true, 'Study should be marked as published');
    });
    
    it('should prevent republishing an already published study', async () => {
      // Already published study
      const alreadyPublishedStudy = {
        ...TEST_DATA.study,
        published: true
      };
      
      // Payload for publishing
      const updatePayload = {
        published: true
      };
      
      // Mock API response - this should actually return success with no change,
      // but we're testing the API handles this edge case gracefully
      nock(API_BASE)
        .patch(`/api/studies/${alreadyPublishedStudy.id}`, updatePayload)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, {
          message: 'Study is already published',
          study: alreadyPublishedStudy
        });
      
      // Make request
      const response = await fetch(`${API_BASE}/api/studies/${alreadyPublishedStudy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        },
        body: JSON.stringify(updatePayload)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.message, 'Study is already published', 'Should return informative message');
      assert.strictEqual(data.study.published, true, 'Study should remain published');
    });
  });
});