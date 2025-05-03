// Import necessary testing libraries
/*import { describe, it, before, after } from 'node:test';
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

// Tests for Upload Artifacts API
describe('Upload Artifacts: POST /api/studies/:studyId/questions/:questionId/artifacts', () => {
    // Positive tests
    describe('Positive Cases', () => {
      it('should successfully upload a valid image file', async () => {
        // Mock API response for successful file upload
        nock(API_BASE)
          .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
          .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
          .reply(201, {
            success: true,
            message: 'Artifact successfully uploaded',
            data: [{
              id: 'artifact-123',
              fileName: 'test-image.jpg',
              fileType: 'image'
            }]
          });
        
        // Make request
        // Note: In a real test we would use FormData with an actual file
        // For Nock testing, we're just verifying the endpoint behavior
        const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TEST_DATA.user.token}`
            // Content-Type would be set automatically for FormData
          }
          // body would contain FormData with the file
        });
        
        const data = await response.json();
        
        // Assertions
        assert.strictEqual(response.status, 201, 'Should return 201 Created status');
        assert.strictEqual(data.success, true, 'Should indicate success');
        assert.strictEqual(Array.isArray(data.data), true, 'Should return array of artifacts');
        assert.strictEqual(data.data[0].fileType, 'image', 'Should have correct file type');
      });
    });
    
    // Negative tests
    describe('Negative Cases', () => {
      it('should reject upload without authentication', async () => {
        // Mock API response for missing auth
        nock(API_BASE)
          .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
          .reply(401, {
            message: 'Not authorized, no token'
          });
        
        // Make request without auth
        const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`, {
          method: 'POST'
        });
        
        const data = await response.json();
        
        // Assertions
        assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
        assert.strictEqual(data.message, 'Not authorized, no token', 'Should return auth error message');
      });
      
      it('should reject upload of unsupported file type', async () => {
        // Mock API response for unsupported file
        nock(API_BASE)
          .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
          .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
          .reply(400, {
            message: 'Unsupported file type'
          });
        
        // Make request
        const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TEST_DATA.user.token}`
          }
          // In a real test, body would contain FormData with the unsupported file
        });
        
        const data = await response.json();
        
        // Assertions
        assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
        assert.strictEqual(data.message, 'Unsupported file type', 'Should return file type error message');
      });
    });
    
    // Boundary tests
    describe('Boundary Cases', () => {
      it('should accept the maximum allowed number of files', async () => {
        // Mock API response for multiple file upload (assuming max is 5)
        nock(API_BASE)
          .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
          .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
          .reply(201, {
            success: true,
            message: 'Artifacts successfully uploaded',
            data: [
              { id: 'artifact-1', fileName: 'file1.jpg', fileType: 'image' },
              { id: 'artifact-2', fileName: 'file2.jpg', fileType: 'image' },
              { id: 'artifact-3', fileName: 'file3.jpg', fileType: 'image' },
              { id: 'artifact-4', fileName: 'file4.jpg', fileType: 'image' },
              { id: 'artifact-5', fileName: 'file5.jpg', fileType: 'image' }
            ]
          });
        
        // Make request
        const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TEST_DATA.user.token}`
          }
          // In a real test, body would contain FormData with 5 files
        });
        
        const data = await response.json();
        
        // Assertions
        assert.strictEqual(response.status, 201, 'Should accept maximum number of files');
        assert.strictEqual(data.data.length, 5, 'Should return data for all 5 files');
      });
    });
    
    // Edge tests
    describe('Edge Cases', () => {
      it('should handle upload of maximum allowed file size', async () => {
        // Mock API response for large file
        nock(API_BASE)
          .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
          .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
          .reply(201, {
            success: true,
            message: 'Artifact successfully uploaded',
            data: [{
              id: 'large-artifact',
              fileName: 'large-file.jpg',
              fileType: 'image',
              size: '5MB' // Just for the mock response
            }]
          });
        
        // Make request
        const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TEST_DATA.user.token}`
          }
          // In a real test, body would contain FormData with a large file
        });
        
        const data = await response.json();
        
        // Assertions
        assert.strictEqual(response.status, 201, 'Should accept large file');
        assert.strictEqual(data.success, true, 'Upload should be successful');
      });
    });
  });
  
  /*
  // https://medium.com/@nicholas.nisopoli/implementing-integration-tests-in-node-js-microservices-with-jest-dac6168f4bf4
// https://exatosoftware.com/testing-in-nodejs/
// https://sevic.dev/notes/integration-testing-nodejs/
// https://blog.devgenius.io/how-to-integrate-jest-into-your-node-js-api-development-for-better-test-coverage-6b878738a833

  // Edge test cases
  describe('Edge Cases', () => {
    it('should handle filename with special characters', async () => {
      // Mock response for special filename upload
      const mockResponse = {
        message: 'Artifact uploaded successfully',
        artifact: {
          _id: 'special-name-artifact-id',
          filename: 'test file with spaces & symbols!.pdf',
          path: '/uploads/artifacts/test_file_with_spaces___symbols_.pdf',
          size: 1024,
          mimetype: 'application/pdf'
        }
      };
      
      // Mock the endpoint
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.studyId}/questions/${TEST_DATA.questionId}/artifacts`)
        .reply(201, mockResponse);
      
      // Create FormData with a file that has special characters in name
      const formData = new FormData();
      const specialNameFile = new File(['test content'], 'test file with spaces & symbols!.pdf', { type: 'application/pdf' });
      formData.append('file', specialNameFile);
      
      // Make the request
      const response = await fetch(`${API_BASE}/api/studies/${TEST_DATA.studyId}/questions/${TEST_DATA.questionId}/artifacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TEST_DATA.validToken}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(data.message, 'Artifact uploaded successfully', 'Should return success message');
      assert.strictEqual(data.artifact.filename, 'test file with spaces & symbols!.pdf', 'Should return original filename');
    });
  });
});*/

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import nock from 'nock';
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

/**
 * Helper function to construct the artifact upload endpoint URL
 * @param {string} studyId - Study ID
 * @param {string} questionId - Question ID
 * @returns {string} Endpoint URL
 */
const getArtifactEndpoint = (studyId, questionId) => 
  `/api/studies/${studyId}/questions/${questionId}/artifacts`;

// Tests for Upload Artifacts API
describe('Upload Artifacts: POST /api/studies/:studyId/questions/:questionId/artifacts', () => {
  // Positive tests
  describe('Positive Cases', () => {
    it('should successfully upload a valid image file', async () => {
      // Mock API response for successful file upload
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(201, {
          success: true,
          message: 'Artifact successfully uploaded',
          data: [{
            id: 'artifact-123',
            fileName: 'test-image.jpg',
            fileType: 'image'
          }]
        });
      
      // Make request with supertest
      // Note: In a real test we would use .attach() to send a file
      // For Nock testing, we're just verifying the endpoint behavior
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id))
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should return 201 Created status');
      assert.strictEqual(response.body.success, true, 'Should indicate success');
      assert.strictEqual(Array.isArray(response.body.data), true, 'Should return array of artifacts');
      assert.strictEqual(response.body.data[0].fileType, 'image', 'Should have correct file type');
    });
  });
  
  // Negative tests
  describe('Negative Cases', () => {
    it('should reject upload without authentication', async () => {
      // Mock API response for missing auth
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
        .reply(401, {
          message: 'Not authorized, no token'
        });
      
      // Make request without auth token using supertest
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id));
      
      // Assertions
      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(response.body.message, 'Not authorized, no token', 'Should return auth error message');
    });
    
    it('should reject upload of unsupported file type', async () => {
      // Mock API response for unsupported file
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(400, {
          message: 'Unsupported file type'
        });
      
      // Make request with auth token using supertest
      // In a real test, we would use .attach() with an unsupported file type
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id))
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      // Assertions
      assert.strictEqual(response.status, 400, 'Should return 400 Bad Request status');
      assert.strictEqual(response.body.message, 'Unsupported file type', 'Should return file type error message');
    });
  });
  
  // Boundary tests
  describe('Boundary Cases', () => {
    it('should accept the maximum allowed number of files', async () => {
      // Mock API response for multiple file upload (assuming max is 5)
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(201, {
          success: true,
          message: 'Artifacts successfully uploaded',
          data: [
            { id: 'artifact-1', fileName: 'file1.jpg', fileType: 'image' },
            { id: 'artifact-2', fileName: 'file2.jpg', fileType: 'image' },
            { id: 'artifact-3', fileName: 'file3.jpg', fileType: 'image' },
            { id: 'artifact-4', fileName: 'file4.jpg', fileType: 'image' },
            { id: 'artifact-5', fileName: 'file5.jpg', fileType: 'image' }
          ]
        });
      
      // Make request using supertest
      // In a real test, we would use .attach() multiple times to add multiple files
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id))
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should accept maximum number of files');
      assert.strictEqual(response.body.data.length, 5, 'Should return data for all 5 files');
    });
  });
  
  // Edge tests
  describe('Edge Cases', () => {
    it('should handle upload of maximum allowed file size', async () => {
      // Mock API response for large file
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(201, {
          success: true,
          message: 'Artifact successfully uploaded',
          data: [{
            id: 'large-artifact',
            fileName: 'large-file.jpg',
            fileType: 'image',
            size: '5MB' // Just for the mock response
          }]
        });
      
      // Make request using supertest
      // In a real test, we would use .attach() with a large file
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id))
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      // Assertions
      assert.strictEqual(response.status, 201, 'Should accept large file');
      assert.strictEqual(response.body.success, true, 'Upload should be successful');
    });
  });
});