import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import uploadService from '../../services/uploadService';
import jobsService from '../../services/jobsService';
import authService from '../../services/authService';

const CVUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('job');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    coverNote: '',
    cvFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login?redirect=cv-upload' + (jobId ? `?job=${jobId}` : ''));
      return;
    }

    // If we have a job ID, fetch job details
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId, navigate]);

  const loadJobDetails = async () => {
    try {
      const job = await jobsService.getJobById(jobId);
      setJobTitle(job.title || 'Selected Position');
    } catch (error) {
      console.error('Error loading job details:', error);
      // Continue without job title if we can't fetch it
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'cvFile' && files && files[0]) {
      setFormData({
        ...formData,
        cvFile: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.cvFile) {
        throw new Error('Please select a CV file to upload');
      }

      // 1. Upload the CV file directly
      const uploadResult = await uploadService.uploadCV(formData.cvFile);
      
      // 2. Apply to the job with the CV URL (if we have a job ID)
      if (jobId) {
        await jobsService.applyToJob({
          job_id: jobId,
          cv_url: uploadResult.file_url,
          cover_note: formData.coverNote || `Application from ${formData.firstName} ${formData.lastName}`
        });
        
        // 3. Navigate to a success page
        navigate('/application-submitted');
      } else {
        // If no job ID, just show a success message
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      setError('Failed to upload CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="apply-section">
        <h2>{jobId ? `Apply for ${jobTitle}` : 'Upload Your CV'}</h2>
      </div>
      
      <div className="cv-section">
        <form id="cvForm" encType="multipart/form-data" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              value={formData.firstName}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              value={formData.lastName}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverNote">Cover Note:</label>
            <textarea 
              id="coverNote" 
              name="coverNote" 
              value={formData.coverNote}
              onChange={handleChange}
              rows="4"
              placeholder="Briefly explain why you're interested in this position (optional)"
            />
          </div>

          <div className="form-group cv-upload">
            <h3>Upload Your CV</h3>
            <p>Please upload your CV in PDF, DOC, or DOCX format.</p>

            <label htmlFor="cvFile">Upload CV:</label>
            <input 
              type="file" 
              id="cvFile" 
              name="cvFile" 
              accept=".pdf,.doc,.docx" 
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CVUpload; 