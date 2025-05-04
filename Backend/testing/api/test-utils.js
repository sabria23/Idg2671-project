import nock from 'nock';

export const API_BASE = 'http://localhost:8000';

// Test data
export const TEST_DATA = {
  user: {
    id: '67f299357b36b34ba6a0c930',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMCIsImlhdCI6MTc0NjA0NTQxNSwiZXhwIjoxNzQ2MDQ5MDE1fQ.ua3FjeRFwTjJaf8fJ65uW5ckij5GCy6RD_YNAvqE4Do'
  },
  otherUser: {
    id: '67f299357b36b34ba6a0c931',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMSIsImlhdCI6MTc0NjA0NTQxNSwiZXhwIjoxNzQ2MDQ5MDE1fQ.8dMLG3qMNpqCV7PadkRh_Q7HK2XTB4Kn0AEtX5Dd9aE'
  },
  expiredToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjI5OTM1N2IzNmIzNGJhNmEwYzkzMCIsImlhdCI6MTY0NjA0NTQxNSwiZXhwIjoxNjQ2MDQ5MDE1fQ.PwQTVG1QNwZ33vODlkQ4v5-Y_8SjW3iF63NQnOBJpnI',
  study: {
    id: 'test-study-123',
    title: 'Test Study',
    description: 'This is a test study for API integration tests',
    creator: '67f299357b36b34ba6a0c930',
    // Add the questions array that your tests expect
    questions: [
      { _id: 'test-question-selection', type: 'selection' },
      { _id: 'test-question-text', type: 'text' },
      { _id: 'test-question-numeric', type: 'numeric' },
      { _id: 'test-question-longtext', type: 'text' }
    ]
  },
  session: {
    id: 'test-session-456'
  },
  // Add the sessionWithResponses object
  sessionWithResponses: {
    id: 'test-session-with-responses'
  },
  question: {
    id: 'test-question-789'
  },
  // Add the answers object with all required types
  answers: {
    selection: {
      answer: 'Option A',
      answerType: 'selection',
      skipped: false
    },
    numeric: {
      answer: 42,
      answerType: 'numeric',
      skipped: false
    },
    text: {
      answer: 'Text response',
      answerType: 'text',
      skipped: false
    },
    skipped: {
      answerType: 'text',
      skipped: true
    }
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
};

export const teardownNock = () => {
  // Clean up all nock interceptors
  nock.cleanAll();
  // Re-enable network connections
  nock.enableNetConnect();
};


/*Why Allow Localhost Connections?
The line nock.enableNetConnect('localhost'); is important because:

nock.disableNetConnect() prevents all real HTTP requests during tests
nock.enableNetConnect('localhost') makes an exception for localhost connections

This is needed because your tests use Supertest to make requests to a URL, but those requests shouldn't actually go to the network. Instead, Nock intercepts them and returns mock responses. The localhost exception makes this possible.*/
/*The .set() method is for setting http headers, not responses status. The Testing Architecture
Here's what's happening in your tests:
You have setupNock() and teardownNock() functions that configure Nock to intercept all HTTP requests during tests.
In the test-utils.js file, you have TEST_DATA with mock users, tokens, studies, questions, and answers for testing.
In each test case, you use Nock to define what happens when a specific API endpoint is called - what response code and data should be returned.
Then you use Supertest to make a request to that endpoint and verify that your code handles the response correctly.
*/