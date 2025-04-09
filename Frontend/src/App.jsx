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
//import StudyParticipationPage from './pages/StudyParticipationPage';
import PortectedRoute from './components/auth/PortectedRoute.jsx';

const App = () => {
    //const { user } = useAuth();

    return (
      <Router>
        <Routes>
          {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />

            {/*Portected routes */}
            <Route path="/dashboard" element={
              <PortectedRoute>
                <DashboardPage />
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

             <Route path="/recruit" element={
                <PortectedRoute>
                  <RecruitmentPage />
                </PortectedRoute>
              } />

               <Route path="/export-result" element={
                <PortectedRoute>
                  <ExportPage />
                </PortectedRoute>
              } />
           
           {/* this route is for redirected root to dash */}
           <Route path="/" element={<Navigate to="/dashboard" />} />

  
        </Routes>
      </Router>
    );
  }

export default App
