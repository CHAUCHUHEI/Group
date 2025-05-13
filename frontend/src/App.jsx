import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext';

// Import pages
import JobsPage from './pages/jobs/JobsPage.jsx';
import JobDetail from './pages/jobs/JobDetail.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Unauthorized from './pages/auth/Unauthorized.jsx';
import CVUpload from './pages/applications/CVUpload.jsx';
import QuestionnairePage from './pages/questionnaire/QuestionnairePage.jsx';
import QuestionnaireResults from './pages/questionnaire/QuestionnaireResults.jsx';

// Home page component
const Home = () => (
  <div id="wrapper">
    <header className="banner">
      <h1>Welcome to the Alcatraz home page.</h1>
      <h4>Alcatraz is a military prison and a maximum security federal
        penitentiary. No inmate has ever successfully escaped this prison, do you have what it takes
        to keep it that way?
      </h4>
    </header>
    
    <article className="article">
      <h1>Application steps</h1>
      <ul>
        <li>Log in/sign up</li>
        <li>Complete the questionnaire page - this will then give you recommendations for the jobs that most suit you</li>
        <li>Submit your CV</li>
        <li>Then you may be selected to complete the next stage which is a video interview</li>
        <li>If this is successful you will then have the opportunity to attend an in person interview</li>
      </ul>
    </article>
  </div>
);

// Simple success page for application submission
const ApplicationSubmitted = () => (
  <div className="container">
    <div className="success-message">
      <h2>Application Submitted Successfully!</h2>
      <p>Thank you for your application. We will review your CV and get back to you soon.</p>
      <a href="/jobs" className="button">View More Jobs</a>
    </div>
  </div>
);

// Profile placeholder
const Profile = () => (
  <div className="container">
    <h1>My Profile</h1>
    <p>Your profile details and application history will appear here.</p>
  </div>
);

function App() {
  const { loading } = useAuth();

  // Show loading indicator while authenticating
  if (loading) {
    return <div className="loading-app">Loading...</div>;
  }

  return (
    <div className="app">
      <a id="top"></a>
      <Header />

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes - require authentication */}
          <Route path="/questionnaire" element={
            <ProtectedRoute>
              <QuestionnairePage />
            </ProtectedRoute>
          } />
          <Route path="/questionnaire/results" element={
            <ProtectedRoute>
              <QuestionnaireResults />
            </ProtectedRoute>
          } />
          <Route path="/cv-upload" element={
            <ProtectedRoute>
              <CVUpload />
            </ProtectedRoute>
          } />
          <Route path="/application-submitted" element={
            <ProtectedRoute>
              <ApplicationSubmitted />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App; 