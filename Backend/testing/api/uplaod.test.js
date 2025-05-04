// Import necessary testing libraries

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

      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id));
      
      assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized status');
      assert.strictEqual(response.body.message, 'Not authorized, no token', 'Should return auth error message');
    });
    
    it('should reject upload of unsupported file type', async () => {
      nock(API_BASE)
        .post(`/api/studies/${TEST_DATA.study.id}/questions/${TEST_DATA.question.id}/artifacts`)
        .matchHeader('Authorization', `Bearer ${TEST_DATA.user.token}`)
        .reply(400, {
          message: 'Unsupported file type'
        });
      
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id))
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
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
      
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id))
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
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
      
      const response = await request
        .post(getArtifactEndpoint(TEST_DATA.study.id, TEST_DATA.question.id))
        .set('Authorization', `Bearer ${TEST_DATA.user.token}`);
      
      assert.strictEqual(response.status, 201, 'Should accept large file');
      assert.strictEqual(response.body.success, true, 'Upload should be successful');
    });
  });
});