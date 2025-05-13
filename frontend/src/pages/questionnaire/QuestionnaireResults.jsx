import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import questionnaireService from '../../services/questionnaireService';
import jobsService from '../../services/jobsService';
import authService from '../../services/authService';
import './QuestionnaireResults.css';

const QuestionnaireResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobMatches, setJobMatches] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formattedAnswers, setFormattedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login?redirect=questionnaire/results');
      return;
    }

    // Load job recommendations when component mounts
    loadJobRecommendations();
    loadQuestionnaireData();
  }, [navigate]);

  const loadQuestionnaireData = async () => {
    try {
      // Get questionnaire data to display formatted answers later
      const response = await questionnaireService.getQuestionnaire();
      setQuestions(response.questions || []);
    } catch (error) {
      console.error('Error loading questionnaire data:', error);
    }
  };

  const loadJobRecommendations = async () => {
    try {
      setLoading(true);
      const response = await questionnaireService.getJobRecommendations();
      
      if (response.jobs && response.jobs.length > 0) {
        setJobMatches(response.jobs);
        // Set the top match as selected by default
        setSelectedJob(response.jobs[0]);
      } else {
        setJobMatches([]);
        setSelectedJob(null);
      }
    } catch (error) {
      console.error('Error loading job recommendations:', error);
      setError('Failed to load job recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#2196f3'; // Blue
    if (score >= 40) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your job matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Job Recommendations</h1>
        <div className="error-message">{error}</div>
        <Link to="/questionnaire" className="button">Retake Questionnaire</Link>
      </div>
    );
  }

  if (jobMatches.length === 0) {
    return (
      <div className="container">
        <h1>Job Recommendations</h1>
        <div className="no-results">
          <p>No job matches found based on your questionnaire responses.</p>
          <div className="action-buttons">
            <Link to="/questionnaire" className="button">Retake Questionnaire</Link>
            <Link to="/jobs" className="button secondary">Browse All Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1>Your Job Matches</h1>
      <p>Based on your questionnaire responses, we've found the following job matches for you.</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="results-layout">
        <div className="job-list">
          <h2>Job Matches</h2>
          {jobMatches.map((job) => (
            <div
              key={job.id}
              className={`job-list-item ${selectedJob?.id === job.id ? 'selected' : ''}`}
              onClick={() => handleSelectJob(job)}
            >
              <div className="job-list-header">
                <h3>{job.title}</h3>
                <span 
                  className="match-score-badge" 
                  style={{ backgroundColor: getScoreColor(job.match_score) }}
                >
                  {job.match_score}%
                </span>
              </div>
              <p className="job-category">{job.category}</p>
            </div>
          ))}
        </div>
        
        {selectedJob && (
          <div className="job-details">
            <h2>{selectedJob.title}</h2>
            
            <div className="match-overview">
              <h3>Match Overview</h3>
              
              <div className="match-score-large">
                <div 
                  className="match-circle" 
                  style={{ backgroundColor: `${getScoreColor(selectedJob.match_score)}20`, borderColor: getScoreColor(selectedJob.match_score) }}
                >
                  <span>{selectedJob.match_score}%</span>
                </div>
                <p>Overall Match</p>
              </div>
              
              <div className="match-details">
                <div className="match-category">
                  <h4>General Eligibility</h4>
                  <div className="match-bar-container">
                    <div 
                      className="match-bar" 
                      style={{ 
                        width: `${(selectedJob.match_details.general_eligibility / 5) * 100}%`,
                        backgroundColor: getScoreColor((selectedJob.match_details.general_eligibility / 5) * 100)
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="match-category">
                  <h4>Skills Match</h4>
                  <div className="match-bar-container">
                    <div 
                      className="match-bar" 
                      style={{ 
                        width: `${(selectedJob.match_details.skills_match / 10) * 100}%`,
                        backgroundColor: getScoreColor((selectedJob.match_details.skills_match / 10) * 100)
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="match-category">
                  <h4>Preference Match</h4>
                  <div className="match-bar-container">
                    <div 
                      className="match-bar" 
                      style={{ 
                        width: `${(selectedJob.match_details.preference_match / 3) * 100}%`,
                        backgroundColor: getScoreColor((selectedJob.match_details.preference_match / 3) * 100)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="job-description">
              <h3>Job Description</h3>
              <p>{selectedJob.description}</p>
            </div>
            
            <div className="job-actions">
              <Link to={`/jobs/${selectedJob.id}`} className="view-details-btn">
                View Full Details
              </Link>
              <Link to={`/jobs/${selectedJob.id}/apply`} className="apply-btn">
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <Link to="/questionnaire" className="button">Retake Questionnaire</Link>
        <Link to="/jobs" className="button secondary">Browse All Jobs</Link>
      </div>
    </div>
  );
};

export default QuestionnaireResults; 