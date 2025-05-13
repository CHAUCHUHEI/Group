import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import jobsService from '../../services/jobsService';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobDetails = await jobsService.getJobById(id);
      setJob(jobDetails);
    } catch (error) {
      console.error('Error loading job details:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading job details...</div>;
  
  if (error) return (
    <div className="container">
      <div className="error-message">{error}</div>
      <Link to="/jobs" className="button">Back to Jobs</Link>
    </div>
  );

  if (!job) return (
    <div className="container">
      <div className="error-message">Job not found</div>
      <Link to="/jobs" className="button">Back to Jobs</Link>
    </div>
  );

  return (
    <div className="container">
      <div className="job-detail">
        <h1>{job.title}</h1>
        
        <div className="job-meta">
          <div className="meta-item">
            <span className="meta-label">Location:</span>
            <span className="meta-value">{job.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">{job.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Salary:</span>
            <span className="meta-value">{job.salary || 'Not specified'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Posted by:</span>
            <span className="meta-value">{job.postedBy?.name || 'Unknown'}</span>
          </div>
        </div>
        
        <div className="job-section">
          <h2>Description</h2>
          <p>{job.description}</p>
        </div>
        
        {job.requirements && (
          <div className="job-section">
            <h2>Requirements</h2>
            <p>{job.requirements}</p>
          </div>
        )}
        
        <div className="job-actions">
          <Link to={`/cv-upload?job=${job.id}`} className="apply-btn">Apply for this Job</Link>
          <Link to="/jobs" className="back-btn">Back to Jobs</Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 