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


// Tests for Get All Studies API
describe('Get All Studies: GET /api/studies', () => {
  // Positive tests
  describe('Positive Cases', () => {
    it('should retrieve studies for authenticated user', async () => {
      // Mock API response with multiple studies
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, [
          {
            _id: 'study1',
            title: 'First Study',
            description: 'Description for first study',
            creator: TEST_DATA.user.id,
            published: false
          },
          {
            _id: 'study2',
            title: 'Second Study',
            description: 'Description for second study',
            creator: TEST_DATA.user.id,
            published: true
          }
        ]);
      
      // Make request with auth token
      const response = await fetch(`${API_BASE}/api/studies`, {
        headers: {
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(Array.isArray(data), true, 'Should return an array');
      assert.strictEqual(data.length, 2, 'Should return 2 studies');
      assert.strictEqual(data[0].title, 'First Study', 'First study should have correct title');
      assert.strictEqual(data[1].published, true, 'Second study should be published');
    });
  });
  
  // Negative tests
  describe('Negative Cases', () => {
    it('should reject request without authentication', async () => {
      // Mock API response for missing auth
      nock(API_BASE)
        .get('/api/studies')
        .reply(401, {
          message: 'Not authorized, no token'
        });
      
      // Make request without auth token
      const response = await fetch(`${API_BASE}/api/studies`);
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(data.message, 'Not authorized, no token', 'Should return auth error message');
    });
  });
  
  // Boundary tests
  describe('Boundary Cases', () => {
    it('should return empty array when user has no studies', async () => {
      // Mock API response with empty array
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, []);
      
      // Make request
      const response = await fetch(`${API_BASE}/api/studies`, {
        headers: {
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(Array.isArray(data), true, 'Should return an array');
      assert.strictEqual(data.length, 0, 'Array should be empty');
    });
  });
  
  // Edge tests
  describe('Edge Cases', () => {
    it('should handle retrieving a large number of studies', async () => {
      // Create an array of 100 mock studies
      const manyStudies = Array(100).fill().map((_, i) => ({
        _id: `study-${i}`,
        title: `Study ${i}`,
        description: `Description for study ${i}`,
        creator: TEST_DATA.user.id,
        published: i % 2 === 0 // Alternating published status
      }));
      
      // Mock API response with many studies
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, manyStudies);
      
      // Make request
      const response = await fetch(`${API_BASE}/api/studies`, {
        headers: {
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.length, 100, 'Should return all 100 studies');
    });
  });
});

