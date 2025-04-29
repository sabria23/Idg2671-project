import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react'
import "../src/App.css";
// Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashPage';
import CreateStudyPage from './pages/studies/CreateStudyPage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage.jsx';
import ExportPage from './pages/exportResults/ExportPage.jsx';
import SurveyPage from './pages/survey/SurveyPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import PortectedRoute from './components/auth/PortectedRoute.jsx';


const App = () => {
    //const { user } = useAuth();

    return (
      <Router>
        <Routes>
          {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
           <Route path="/study/:studyId/preview" element={<SurveyPage mode="preview"/>} />
            <Route path="/study/:studyId/" element={<SurveyPage />} />

            {/*Portected routes */}
            <Route path="/dashboard" element={
              <PortectedRoute>
                <DashboardPage />
              </PortectedRoute>
            } />

              <Route path="/profile" element={
                <PortectedRoute>
                  <ProfilePage />
                </PortectedRoute>
              } />

            <Route path="/study/:studyId" element={
              <PortectedRoute>
                <CreateStudyPage />
              </PortectedRoute>
            } />

            <Route path="/create-study" element={
              <PortectedRoute>
                <CreateStudyPage />
              </PortectedRoute>
            } />

             <Route path="/recruit/:studyId?" element={
                <PortectedRoute>
                  <RecruitmentPage />
                </PortectedRoute>
              } />

               <Route path="/export-results/:studyId" element={
                <PortectedRoute>
                  <ExportPage />
                </PortectedRoute>
              } />
           
           {/* this route is for redirected root to dash */}
           <Route path="/" element={<Navigate to="/dashboard" />} />
           <Route path="/study/:studyId/preview" element={<SurveyPage mode="preview" />} />


  
        </Routes>
      </Router>
    );
  }

export default App
