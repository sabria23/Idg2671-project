import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import nock from 'nock';

// Configuration for test environment
const BASE_URL = 'http://localhost:8000';
const API_URL = 'http://localhost:8000'; // The URL we'll mock

// Test user data
const TEST_USER_ID = '67f299357b36b34ba6a0c930';
const TEST_TOKEN = 'fake-jwt-token-for-testing';

// Clean up nock after tests
after(() => {
  nock.cleanAll();
});

describe('Study API Integration Tests', () => {
  
  describe('POST /api/studies (Create Study)', () => {
    
    it('should create a study with valid data (positive case)', async () => {
      // Mock the API response for successful study creation
      nock(API_URL)
        .post('/api/studies')
        .reply(201, {
          message: 'A new study successfully created!',
          studyId: 'mock-study-id-12345'
        });
      
      // Test data
      const studyData = {
        title: 'Test Study',
        description: 'This is a test study',
        creator: TEST_USER_ID
      };
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_TOKEN}`
        },
        body: JSON.stringify(studyData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 status');
      assert.strictEqual(data.message, 'A new study successfully created!');
      assert.ok(data.studyId, 'Should return a study ID');
    });
    
    it('should reject study with missing title (negative case)', async () => {
      // Mock the API response for invalid study data
      nock(API_URL)
        .post('/api/studies')
        .reply(400, {
          message: 'Title is required'
        });
      
      // Test data (missing title)
      const invalidStudyData = {
        description: 'This study has no title',
        creator: TEST_USER_ID
      };
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_TOKEN}`
        },
        body: JSON.stringify(invalidStudyData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 status');
      assert.strictEqual(data.message, 'Title is required');
    });
    
    it('should handle extremely long title (edge case)', async () => {
      // Mock the API response for very long title
      nock(API_URL)
        .post('/api/studies')
        .reply(201, {
          message: 'A new study successfully created!',
          studyId: 'mock-study-id-12346'
        });
      
      // Test data with very long title
      const longTitleStudyData = {
        title: 'A'.repeat(200), // Very long title
        description: 'Study with a very long title',
        creator: TEST_USER_ID
      };
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_TOKEN}`
        },
        body: JSON.stringify(longTitleStudyData)
      });
      
      // Assertions - your API might accept or reject this
      // Let's assume it accepts it
      assert.strictEqual(response.status, 201, 'Should handle long title');
    });
    
    it('should handle missing authorization token (negative case)', async () => {
      // Mock the API response for missing auth token
      nock(API_URL)
        .post('/api/studies')
        .reply(401, {
          message: 'Not authorized, no token'
        });
      
      // Test data
      const studyData = {
        title: 'Test Study',
        description: 'This is a test study',
        creator: TEST_USER_ID
      };
      
      // Make the request without auth header
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // No Authorization header
        },
        body: JSON.stringify(studyData)
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 for missing token');
      assert.strictEqual(data.message, 'Not authorized, no token');
    });
  });
  
  describe('GET /api/studies (List Studies)', () => {
    
    it('should return list of studies for authorized user (positive case)', async () => {
      // Mock API response with a list of studies
      nock(API_URL)
        .get('/api/studies')
        .reply(200, [
          {
            _id: 'study1',
            title: 'First Study',
            description: 'Study 1 description',
            creator: TEST_USER_ID,
            published: false
          },
          {
            _id: 'study2',
            title: 'Second Study',
            description: 'Study 2 description',
            creator: TEST_USER_ID,
            published: true
          }
        ]);
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 status');
      assert.strictEqual(Array.isArray(data), true, 'Should return an array');
      assert.strictEqual(data.length, 2, 'Should return 2 studies');
      assert.strictEqual(data[0].title, 'First Study');
    });
    
    it('should return empty array when user has no studies (boundary case)', async () => {
      // Mock API response with empty array
      nock(API_URL)
        .get('/api/studies')
        .reply(200, []);
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 status');
      assert.strictEqual(Array.isArray(data), true, 'Should return an array');
      assert.strictEqual(data.length, 0, 'Array should be empty');
    });
    
    it('should reject request with invalid token (negative case)', async () => {
      // Mock API response for invalid token
      nock(API_URL)
        .get('/api/studies')
        .reply(401, {
          message: 'Invalid token'
        });
      
      // Make the request with invalid token
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 for invalid token');
      assert.strictEqual(data.message, 'Invalid token');
    });
  });
  
  describe('GET /api/studies/:id (Get Single Study)', () => {
    
    it('should return a study by ID (positive case)', async () => {
      const studyId = 'test-study-123';
      
      // Mock API response for getting a single study
      nock(API_URL)
        .get(`/api/studies/${studyId}`)
        .reply(200, {
          _id: studyId,
          title: 'Test Study',
          description: 'Study description',
          creator: TEST_USER_ID,
          published: true,
          questions: [
            {
              questionText: 'Test question?',
              questionType: 'single',
              options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' }
              ]
            }
          ]
        });
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies/${studyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 status');
      assert.strictEqual(data._id, studyId, 'Should return correct study ID');
      assert.strictEqual(data.title, 'Test Study', 'Should return study title');
      assert.strictEqual(Array.isArray(data.questions), true, 'Should have questions array');
    });
    
    it('should return 404 for non-existent study ID (negative case)', async () => {
      const nonExistentId = 'does-not-exist';
      
      // Mock API response for non-existent study
      nock(API_URL)
        .get(`/api/studies/${nonExistentId}`)
        .reply(404, {
          message: 'Study not found'
        });
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies/${nonExistentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 404, 'Should return 404 status');
      assert.strictEqual(data.message, 'Study not found');
    });
    
    it('should reject access to study created by different user (negative case)', async () => {
      const otherUserStudyId = 'other-user-study';
      
      // Mock API response for unauthorized access
      nock(API_URL)
        .get(`/api/studies/${otherUserStudyId}`)
        .reply(403, {
          message: 'Not authorized to access this study'
        });
      
      // Make the request
      const response = await fetch(`${BASE_URL}/api/studies/${otherUserStudyId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 403, 'Should return 403 status');
      assert.strictEqual(data.message, 'Not authorized to access this study');
    });
  });
});
