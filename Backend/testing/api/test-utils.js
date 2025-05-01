import nock from 'nock';

// Base URL for API
export const API_BASE = 'http://localhost:8000';

// Test data
export const TEST_DATA = {
  user: {
    id: '67f299357b36b34ba6a0c930',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMCIsImlhdCI6MTc0NjA0NTQxNSwiZXhwIjoxNzQ2MDQ5MDE1fQ.ua3FjeRFwTjJaf8fJ65uW5ckij5GCy6RD_YNAvqE4Do'
  },
  // Adding another user for testing
  otherUser: {
    id: '67f299357b36b34ba6a0c931',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMSIsImlhdCI6MTc0NjA0NTQxNSwiZXhwIjoxNzQ2MDQ5MDE1fQ.8dMLG3qMNpqCV7PadkRh_Q7HK2XTB4Kn0AEtX5Dd9aE'
  },
  // Adding expired token for testing
  expiredToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMCIsImlhdCI6MTY0NjA0NTQxNSwiZXhwIjoxNjQ2MDQ5MDE1fQ.PwQTVG1QNwZ33vODlkQ4v5-Y_8SjW3iF63NQnOBJpnI',
  study: {
    id: 'test-study-123',
    title: 'Test Study',
    description: 'This is a test study for API integration tests',
    creator: '67f299357b36b34ba6a0c930'
  },
  session: {
    id: 'test-session-456'
  },
  question: {
    id: 'test-question-789'
  }
};

// Mock studies data for different test scenarios
export const MOCK_STUDIES = {
  // Studies for the main user
  userStudies: [
    {
      _id: 'study1',
      title: 'User Study 1',
      description: 'First study of the main user',
      creator: TEST_DATA.user.id,
      published: true
    },
    {
      _id: 'study2',
      title: 'User Study 2',
      description: 'Second study of the main user',
      creator: TEST_DATA.user.id,
      published: false
    }
  ],
  
  // Studies for the other user
  otherUserStudies: [
    {
      _id: 'study3',
      title: 'Other User Study',
      description: 'Study of the other user',
      creator: TEST_DATA.otherUser.id,
      published: true
    }
  ],
  
  // Empty array for no studies case
  emptyStudies: [],
  
  // Single study for boundary case
  singleStudy: [
    {
      _id: 'single-study',
      title: 'Only Study',
      description: 'This is the only study for this user',
      creator: TEST_DATA.user.id,
      published: true
    }
  ],
  
  // Create a function to generate many studies for edge case testing
  generateManyStudies(count = 100) {
    return Array(count).fill().map((_, i) => ({
      _id: `study-${i}`,
      title: `Study ${i}`,
      description: `Description for study ${i}`,
      creator: TEST_DATA.user.id,
      published: i % 2 === 0 // Alternating published status
    }));
  }
};

// Setup and teardown helpers
export const setupNock = () => {
  // Disable real network connections during tests
  nock.disableNetConnect();
  // But allow localhost connections
  nock.enableNetConnect('localhost');
  
  console.log('Nock setup complete - HTTP requests will be intercepted');
};

export const teardownNock = () => {
  // Clean up all nock interceptors
  nock.cleanAll();
  // Re-enable network connections
  nock.enableNetConnect();
  
  console.log('Nock teardown complete - HTTP requests restored');
};

// Helper for creating standard API responses
export const mockApiResponses = {
  // Success responses
  success: (endpoint, token, responseData) => {
    return nock(API_BASE)
      .get(endpoint)
      .matchHeader('Authorization', `Bearer ${token}`)
      .reply(200, responseData);
  },
  
  // Error responses
  unauthorized: (endpoint) => {
    return nock(API_BASE)
      .get(endpoint)
      .reply(401, {
        message: 'Not authorized, no token'
      });
  },
  
  tokenExpired: (endpoint, token) => {
    return nock(API_BASE)
      .get(endpoint)
      .matchHeader('Authorization', `Bearer ${token}`)
      .reply(401, {
        message: 'Not authorized, token expired'
      });
  },
  
  serverError: (endpoint, token) => {
    return nock(API_BASE)
      .get(endpoint)
      .matchHeader('Authorization', `Bearer ${token}`)
      .reply(500, {
        message: 'Internal server error'
      });
  },
  
  notFound: (endpoint, token) => {
    return nock(API_BASE)
      .get(endpoint)
      .matchHeader('Authorization', `Bearer ${token}`)
      .reply(404, {
        message: 'Resource not found'
      });
  }
};