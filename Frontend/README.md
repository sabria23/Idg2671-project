instalations you will need for react:
- # React Router for navigation
npm install react-router-dom

# API communication
npm install axios

# Form handling
npm install react-hook-form zod @hookform/resolvers

# Authentication
npm install jwt-decode

# UI components (choose one)
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
# OR
npm install @mui/material @emotion/react @emotion/styled

# react icons
npm install react-icons

FOLDER STRUCTURE: 
src/
  ├── assets/              # Static files (images, fonts, etc.)
  │
  ├── components/          # Reusable UI components
  │   ├── common/          # Truly shared components
  │   │   └── Navbar/      # Navigation bar component
  │ 
  │
  ├── hooks/               # Custom React hooks
  │   ├── useAuth.js       # Authentication hook
  │   └── useStudies.js    # Studies management hook
  │
  ├── pages/               # Full page components
  │   ├── auth/            # Auth pages
  │   │   ├── LoginPage.jsx
  │   │   └── SignupPage.jsx
  │   ├── dashboard/       # Dashboard pages
  │   │   └── DashboardPage.jsx
  │   ├── studies/         # Study management pages
  │   │   ├── CreateStudyPage.jsx
  │   │   └── Prieview?.jsx
  │   └── survey/          # Survey-taking pages
  │       └── SurveyPage.jsx
  │
  ├── services/            # API services
  │   ├── api.js           # Base API setup
  │   ├── authService.js   # Auth API methods
  │   └── studyService.js  # Studies API methods
  │
  ├── styles/              # Global and page-specific styles
  │   ├── global.css       # Global styles
  │   ├── auth.css         # Auth pages styles
  │   └── dashboard.css    # Dashboard styles
  │
  ├── App.jsx              # Main app component with routes
  ├── main.jsx             # Entry point
  └── index.css            # Root styles


  Based on your README endpoints, here's how we would organize them:

authService.js

/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/user
/api/auth/forgot-password (optional)
/api/auth/reset-password (optional)


dashboardService.js

/api/studies (GET - list all studies)
/api/studies/:studyId (DELETE - remove study)
/api/studies/:studyId/public (PATCH - publish/unpublish)
/api/studies/:studyId/public-url (POST - generate URL)
/api/studies/:studyId/invitations (POST - add participants)


studyService.js

/api/studies (POST - create study)
/api/studies/:studyId (GET - get for editing)
/api/studies/:studyId (PATCH - update study)
/api/studies/:studyId/preview (GET - preview)
/api/studies/:studyId/questions (POST - create question)
/api/studies/:studyId/questions/:questionId (PATCH/DELETE - update/delete question)
/api/artifacts endpoints


responseService.js

/api/studies/:studyId/sessions/responses (GET - get responses for export)


surveyService.js

/api/studies/:studyId/sessions (POST - create new session)
/api/studies/:studyId/sessions/:sessionId/:questionId (POST/PATCH - store/update responses)