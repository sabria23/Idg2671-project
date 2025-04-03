import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react'
// Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from './pages/auth/SignupPage';
//import DashboardPage from './pages/DashboardPage';
import CreateStudyPage from './pages/studies/CreateStudyPage';
//import StudyParticipationPage from './pages/StudyParticipationPage';
//import NotFoundPage from './pages/NotFoundPage';

const App = () => {
    //const { user } = useAuth();

    return (
      <Router>
        <Routes>
          {/* Public routes */}
           {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/study/:studyId" element={<CreateStudyPage />} />
  
          {/* Protected routes 
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/create-study" element={user ? <CreateStudyPage /> : <Navigate to="/login" />} />
          <Route path="/edit-study/:studyId" element={user ? <CreateStudyPage /> : <Navigate to="/login" />} />
          
          {/* Redirect root to dashboard if logged in, otherwise to login 
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          
          {/* Catch-all for 404 
          <Route path="*" element={<NotFoundPage />} />*/}
        </Routes>
      </Router>
    );
  }

export default App
