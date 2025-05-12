import api from './api';

// Create axios instance for jobs API calls
const jobsApi = api.createAxiosInstance('jobs');

// Service to handle job-related operations
const jobsService = {
  // Search for jobs with optional filters
  searchJobs: async (filters = {}) => {
    try {
      const { title, category, location, page = 1, limit = 10 } = filters;
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (title) queryParams.append('title', title);
      if (category) queryParams.append('category', category);
      if (location) queryParams.append('location', location);
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      
      const response = await jobsApi.get(`/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },

  // Get job details by ID
  getJobById: async (jobId) => {
    try {
      const response = await jobsApi.get(`/${jobId}`);
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },

  // Get questionnaire questions
  getQuestionnaireQuestions: async () => {
    try {
      const response = await api.get('/questionnaire/questions');
      return response.data;
    } catch (error) {
      console.error('Error getting questionnaire questions:', error);
      throw error;
    }
  },

  // Submit questionnaire answers and get job recommendations
  submitQuestionnaire: async (answers) => {
    try {
      const response = await api.post('/questionnaire/submit', { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      throw error;
    }
  },

  // Create a new job (requires recruiter or admin role)
  createJob: async (jobData) => {
    try {
      const response = await jobsApi.post('/', jobData);
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },

  // Apply to a job (requires job seeker role)
  applyToJob: async (applicationData) => {
    try {
      const response = await jobsApi.post('/apply', applicationData);
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  }
};

export default jobsService; 