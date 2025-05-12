import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobsService from '../../services/jobsService';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    category: ''
  });
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  });

  useEffect(() => {
    // Load jobs when the component mounts
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const searchParams = {
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };
      
      const response = await jobsService.searchJobs(searchParams);
      
      if (response && response.jobs) {
        setJobs(response.jobs);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setJobs([]);
        setError('No jobs found');
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError('Failed to load jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      currentPage: 1 // Reset to first page on new search
    });
    loadJobs();
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPage: newPage
    });
    loadJobs();
  };

  return (
    <div className="container">
      <h1>Job Listings</h1>
      
      <form onSubmit={handleSearch} className="jobs-filter-form">
        <div className="form-row">
          <div>
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="E.g. Prison Officer"
            />
          </div>
          
          <div>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="E.g. Alcatraz Island"
            />
          </div>
          
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Security">Security</option>
              <option value="Management">Management</option>
              <option value="Administration">Administration</option>
              <option value="Facilities">Facilities</option>
              <option value="Food Service">Food Service</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>
          </div>
          
          <button type="submit">Search</button>
        </div>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="jobs-list">
          {jobs.length === 0 ? (
            <p>No jobs found. Try adjusting your filters.</p>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="job-card">
                <h2>{job.title}</h2>
                <div className="job-details">
                  <span><strong>Location:</strong> {job.location}</span>
                  <span><strong>Category:</strong> {job.category}</span>
                  {job.match_score && (
                    <span><strong>Match Score:</strong> {job.match_score}%</span>
                  )}
                </div>
                <div className="job-actions">
                  <Link to={`/jobs/${job.id}`} className="view-job-btn">View Details</Link>
                  <Link to={`/cv-upload?job=${job.id}`} className="apply-btn">Apply Now</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsPage; 