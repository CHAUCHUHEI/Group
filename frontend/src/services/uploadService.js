import api from './api';

// Create axios instance for upload API calls
const uploadApi = api.createAxiosInstance('upload');

const uploadService = {
  // Upload CV directly to server
  uploadCV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadApi.post('/cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  }
};

export default uploadService; 