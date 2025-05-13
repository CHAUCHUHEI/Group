import api from './api';

// Create axios instance for questionnaire API calls
const questionnaireApi = api.createAxiosInstance('questionnaire');

const questionnaireService = {
  // Get questionnaire questions
  getQuestionnaire: async () => {
    try {
      const response = await questionnaireApi.get('/questions');
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },

  // Submit completed questionnaire
  submitQuestionnaire: async (answers) => {
    try {
      const response = await questionnaireApi.post('/submit', { answers });
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },

  // Get job recommendations based on questionnaire responses
  getJobRecommendations: async () => {
    try {
      const response = await questionnaireApi.get('/results');
      return response.data;
    } catch (error) {
      return api.handleApiError(error);
    }
  },
  
  // Utility functions for the questionnaire UI

  // Filter questions by section
  getQuestionsBySection: (questions, sectionId) => {
    if (!questions || !Array.isArray(questions)) return [];
    return questions.filter(q => q.section === sectionId);
  },

  // Validate section answers
  validateSectionAnswers: (questions, answers) => {
    const errors = {};
    
    questions.forEach(question => {
      const answer = answers[question.id];
      
      // Skip validation if question is not required and answer is empty
      if (!question.required && (answer === undefined || answer === null || answer === '')) {
        return;
      }
      
      // Validate based on question type
      switch(question.type) {
        case 'boolean':
          if (answer !== true && answer !== false) {
            errors[question.id] = 'Please select Yes or No';
          }
          break;
        case 'select':
          if (!answer) {
            errors[question.id] = 'Please select an option';
          }
          break;
        case 'multiselect':
          if (!answer || !Array.isArray(answer) || answer.length === 0) {
            errors[question.id] = 'Please select at least one option';
          }
          break;
        case 'text':
          if (!answer || answer.trim() === '') {
            errors[question.id] = 'This field is required';
          }
          break;
        default:
          break;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Calculate progress based on completed sections
  calculateProgress: (sections, completedSections) => {
    if (!sections || !completedSections) return 0;
    return Math.round((completedSections.length / sections.length) * 100);
  },

  // Format the answers for display on the results page
  formatAnswersForDisplay: (answers, questions) => {
    if (!answers || !questions) return {};
    
    const formatted = {};
    
    Object.entries(answers).forEach(([id, value]) => {
      const question = questions.find(q => q.id === id);
      if (!question) return;
      
      formatted[id] = {
        question: question.text,
        answer: value,
        type: question.type
      };
      
      // Format multiselect and select answers
      if (question.type === 'select' && question.options) {
        formatted[id].displayValue = question.options.find(opt => opt === value) || value;
      }
      
      if (question.type === 'multiselect' && Array.isArray(value) && question.options) {
        formatted[id].displayValue = value.join(', ');
      }
      
      if (question.type === 'boolean') {
        formatted[id].displayValue = value ? 'Yes' : 'No';
      }
    });
    
    return formatted;
  }
};

export default questionnaireService; 