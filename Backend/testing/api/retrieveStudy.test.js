import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { 
  API_BASE, 
  TEST_DATA, 
  MOCK_STUDIES, 
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

// Tests for Get All Studies API
describe('Get All Studies: GET /api/studies', () => {
  // Positive tests
  describe('Positive Cases', () => {
    it('should retrieve studies for authenticated user', async () => {
      // Mock API response with multiple studies
      mockApiResponses.success('/api/studies', TEST_DATA.user.token, MOCK_STUDIES.userStudies);
      
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
      assert.strictEqual(data[0].title, 'User Study 1', 'First study should have correct title');
      assert.strictEqual(data[1].published, false, 'Second study should not be published');
    });
    
    it('should retrieve only the authenticated user\'s studies (not studies from other users)', async () => {
      // Mock API response with studies from the user
      mockApiResponses.success('/api/studies', TEST_DATA.user.token, MOCK_STUDIES.userStudies);
      
      // Make request with auth token
      const response = await fetch(`${API_BASE}/api/studies`, {
        headers: {
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(data.length, 2, 'Should return exactly 2 studies');
      
      // Verify all returned studies belong to the authenticated user
      const allBelongToUser = data.every(study => study.creator === TEST_DATA.user.id);
      assert.strictEqual(allBelongToUser, true, 'All studies should belong to the authenticated user');
    });
  });
  
  // Negative tests
  describe('Negative Cases', () => {
    it('should reject request without authentication', async () => {
      // Mock API response for missing auth
      mockApiResponses.unauthorized('/api/studies');
      
      // Make request without auth token
      const response = await fetch(`${API_BASE}/api/studies`);
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(data.message, 'Not authorized, no token', 'Should return auth error message');
    });
    
    it('should reject request with expired token', async () => {
      // Mock API response for expired token
      mockApiResponses.tokenExpired('/api/studies', TEST_DATA.expiredToken);
      
      // Make request with expired token
      const response = await fetch(`${API_BASE}/api/studies`, {
        headers: {
          'Authorization': `Bearer ${TEST_DATA.expiredToken}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(data.message, 'Not authorized, token expired', 'Should return token expired message');
    });
    
    it('should handle server errors gracefully', async () => {
      // Mock API internal server error
      mockApiResponses.serverError('/api/studies', TEST_DATA.user.token);
      
      // Make request that will trigger server error
      const response = await fetch(`${API_BASE}/api/studies`, {
        headers: {
          'Authorization': `Bearer ${TEST_DATA.user.token}`
        }
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 500, 'Should return 500 Internal Server Error status');
      assert.strictEqual(data.message, 'Internal server error', 'Should return server error message');
    });
  });
  
  // Boundary tests
  describe('Boundary Cases', () => {
    it('should return empty array when user has no studies', async () => {
      // Mock API response with empty array
      mockApiResponses.success('/api/studies', TEST_DATA.user.token, MOCK_STUDIES.emptyStudies);
      
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
      const manyStudies = MOCK_STUDIES.generateManyStudies(100);
      
      // Mock API response with many studies
      mockApiResponses.success('/api/studies', TEST_DATA.user.token, manyStudies);
      
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
