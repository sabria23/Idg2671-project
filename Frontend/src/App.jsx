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
import MainLayout from './components/common/MainLayout.jsx';


const App = () => {
    //const { user } = useAuth();

    return (
      <Router>
        <Routes>
          {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/study/:studyId/preview" element={<SurveyPage mode="preview"/>} />
            <Route path="/study/:studyId/live" element={<SurveyPage />} />

            {/*Portected routes */}
            <Route element={<PortectedRoute><MainLayout /></PortectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/study/:studyId" element={<CreateStudyPage />} />
              <Route path="/create-study" element={<CreateStudyPage />} />
              <Route path="/recruit/:studyId?" element={<RecruitmentPage />} /> 
              <Route path="/export-results/:studyId" element={<ExportPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
             </Route>
        </Routes>
      </Router>
    );
  }

export default App
