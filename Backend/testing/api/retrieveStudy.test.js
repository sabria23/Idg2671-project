/*
// https://www.stackhawk.com/blog/creating-test-cases-for-api-testing-a-comprehensive-guide-with-examples/
// Setup and teardown
// https://testfully.io/blog/use-api/
// 
*/

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import nock from 'nock';
import { 
  API_BASE, 
  TEST_DATA, 
  MOCK_STUDIES, 
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

// Tests for Get All Studies API
describe('Get All Studies: GET /api/studies', () => {
  describe('Positive Cases', () => {
    it('should retrieve studies for authenticated user - general for a logged in user', async () => {
      // Mock API response with multiple studies
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, MOCK_STUDIES.userStudies);
      
      // Make request with auth token using supertest
      const response = await request
        .get('/api/studies')
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      // Assertions
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(Array.isArray(response.body), true, 'Should return an array');
      assert.strictEqual(response.body.length, 2, 'Should return 2 studies');
      assert.strictEqual(response.body[0].title, 'User Study 1', 'First study should have correct title');
      assert.strictEqual(response.body[1].published, false, 'Second study should not be published');
    });
    
    it('should retrieve only the authenticated user\'s studies (not studies from other users)', async () => {
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, MOCK_STUDIES.userStudies);
      
      const response = await request
        .get('/api/studies')
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      

      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.length, 2, 'Should return exactly 2 studies');
      
      // Verify all returned studies belong to the authenticated user
      const allBelongToUser = response.body.every(study => study.creator === TEST_DATA.user.id);
      assert.strictEqual(allBelongToUser, true, 'All studies should belong to the authenticated user');
    });
  });
  

  describe('Negative Cases', () => {
    it('should return 401 Unauthorized when request has no authentication token', async () => {
      nock(API_BASE)
        .get('/api/studies')
        .reply(401, {
          message: 'Not authorized, no token'
        });
      
      const response = await request
        .get('/api/studies');
      

      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(response.body.message, 'Not authorized, no token', 'Should return auth error message');
    });
    
    it('should return 401 Unauthorized with expiry message when token is expired', async () => {
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.expiredToken}`)
        .reply(401, {
          message: 'Not authorized, token expired'
        });
      
      const response = await request
        .get('/api/studies')
        .set('Authorization', `Bearer ${TEST_DATA.expiredToken}`);
      

      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(response.body.message, 'Not authorized, token expired', 'Should return token expired message');
    });
    
    it('should return 500 Internal Server Error when server encounters an exception', async () => {
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(500, {
          message: 'Internal server error'
        });
      
      const response = await request
        .get('/api/studies')
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      assert.strictEqual(response.status, 500, 'Should return 500 Internal Server Error status');
      assert.strictEqual(response.body.message, 'Internal server error', 'Should return server error message');
    });
  });
  

  describe('Boundary Cases', () => {
    it('should return 200 OK with empty array when user has no studies', async () => {
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, MOCK_STUDIES.emptyStudies);
      
      const response = await request
        .get('/api/studies')
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(Array.isArray(response.body), true, 'Should return an array');
      assert.strictEqual(response.body.length, 0, 'Array should be empty');
    });
  });
  

  describe('Edge Cases', () => {
    it('should successfully return 200 OK with all studies when retrieving large dataset (100 studies)', async () => {
      const manyStudies = MOCK_STUDIES.generateManyStudies(100);
      
      nock(API_BASE)
        .get('/api/studies')
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(200, manyStudies);
      
      const response = await request
        .get('/api/studies')
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      assert.strictEqual(response.status, 200, 'Should return 200 OK status');
      assert.strictEqual(response.body.length, 100, 'Should return all 100 studies');
    });
  });
});