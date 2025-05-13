import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionnaireService from '../../services/questionnaireService';
import authService from '../../services/authService';
import './Questionnaire.css';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectionErrors, setSectionErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login?redirect=questionnaire');
      return;
    }

    // Load questions when component mounts
    loadQuestions();
  }, [navigate]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionnaireService.getQuestionnaire();
      setSections(response.sections || []);
      setQuestions(response.questions || []);
      
      // Initialize answers
      const initialAnswers = {};
      response.questions?.forEach(q => {
        if (q.type === 'boolean') {
          initialAnswers[q.id] = false;
        } else if (q.type === 'select') {
          initialAnswers[q.id] = q.options?.[0] || '';
        } else if (q.type === 'multiselect') {
          initialAnswers[q.id] = [];
        } else {
          initialAnswers[q.id] = '';
        }
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error loading questionnaire:', error);
      setError('Failed to load questionnaire. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress whenever completedSections or sections change
  useEffect(() => {
    if (sections.length > 0) {
      const newProgress = questionnaireService.calculateProgress(sections, completedSections);
      setProgress(newProgress);
    }
  }, [completedSections, sections]);

  const handleBooleanChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value === 'true' || value === true
    }));
  };

  const handleSelectChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiselectChange = (questionId, value, checked) => {
    setAnswers(prev => {
      const currentValues = prev[questionId] || [];
      let newValues;
      
      if (checked) {
        // Add the value if it's not already present
        newValues = [...currentValues, value];
      } else {
        // Remove the value
        newValues = currentValues.filter(v => v !== value);
      }
      
      return {
        ...prev,
        [questionId]: newValues
      };
    });
  };

  const validateCurrentSection = () => {
    const currentSection = sections[currentSectionIndex];
    if (!currentSection) return { isValid: true, errors: {} };
    
    // Get questions for current section
    const sectionQuestions = questionnaireService.getQuestionsBySection(questions, currentSection.id);
    
    // Validate answers for this section
    return questionnaireService.validateSectionAnswers(sectionQuestions, answers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const validation = validateCurrentSection();
    if (!validation.isValid) {
      setSectionErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await questionnaireService.submitQuestionnaire(answers);
      navigate('/questionnaire/results');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      setError('Failed to submit answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextSection = () => {
    // Validate current section before proceeding
    const validation = validateCurrentSection();
    
    if (!validation.isValid) {
      setSectionErrors(validation.errors);
      return;
    }
    
    // Mark current section as completed if not already
    if (!completedSections.includes(currentSectionIndex)) {
      setCompletedSections(prev => [...prev, currentSectionIndex]);
    }
    
    // Clear section errors
    setSectionErrors({});
    
    // Proceed to next section
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousSection = () => {
    // Clear section errors
    setSectionErrors({});
    
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToSection = (index) => {
    // Can only navigate to completed sections or the next one to complete
    if (
      index >= 0 && 
      index < sections.length && 
      (completedSections.includes(index) || index === completedSections.length || index === currentSectionIndex)
    ) {
      setSectionErrors({});
      setCurrentSectionIndex(index);
      window.scrollTo(0, 0);
    }
  };

  const renderBooleanQuestion = (question) => (
    <div className="boolean-options">
      <label className="radio-label">
        <input
          type="radio"
          name={question.id}
          value="true"
          checked={answers[question.id] === true}
          onChange={() => handleBooleanChange(question.id, true)}
        />
        Yes
      </label>
      <label className="radio-label">
        <input
          type="radio"
          name={question.id}
          value="false"
          checked={answers[question.id] === false}
          onChange={() => handleBooleanChange(question.id, false)}
        />
        No
      </label>
      {sectionErrors[question.id] && (
        <div className="error-message">{sectionErrors[question.id]}</div>
      )}
    </div>
  );

  const renderSelectQuestion = (question) => (
    <div className="select-options">
      <select
        value={answers[question.id] || ''}
        onChange={(e) => handleSelectChange(question.id, e.target.value)}
      >
        <option value="" disabled>Select an option</option>
        {question.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {sectionErrors[question.id] && (
        <div className="error-message">{sectionErrors[question.id]}</div>
      )}
    </div>
  );

  const renderMultiselectQuestion = (question) => (
    <div className="multiselect-options">
      {question.options?.map((option) => (
        <label key={option} className="checkbox-label">
          <input
            type="checkbox"
            value={option}
            checked={(answers[question.id] || []).includes(option)}
            onChange={(e) => handleMultiselectChange(question.id, option, e.target.checked)}
          />
          {option}
        </label>
      ))}
      {sectionErrors[question.id] && (
        <div className="error-message">{sectionErrors[question.id]}</div>
      )}
    </div>
  );

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'boolean':
        return renderBooleanQuestion(question);
      case 'select':
        return renderSelectQuestion(question);
      case 'multiselect':
        return renderMultiselectQuestion(question);
      default:
        return <p>Unsupported question type</p>;
    }
  };

  const renderSectionNavigation = () => (
    <div className="section-navigation">
      {sections.map((section, index) => (
        <button
          key={section.id}
          className={`section-nav-button ${index === currentSectionIndex ? 'active' : ''} ${completedSections.includes(index) ? 'completed' : ''}`}
          onClick={() => goToSection(index)}
          disabled={submitting || (!completedSections.includes(index) && index !== currentSectionIndex && index !== completedSections.length)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  const renderProgressBar = () => {
    return (
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="progress-text">
          Section {currentSectionIndex + 1} of {sections.length} ({progress}% completed)
        </div>
      </div>
    );
  };

  if (loading) return <div className="container">Loading questionnaire...</div>;

  if (sections.length === 0) {
    return (
      <div className="container">
        <h1>Questionnaire</h1>
        <p>No questionnaire questions available. Please try again later.</p>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  // Get questions for current section
  const currentSectionQuestions = questions.filter(q => q.section === currentSection.id);

  return (
    <div className="container questionnaire-container">
      <h1>Skills Assessment Questionnaire</h1>
      <p>Please answer the following questions to help us find the best jobs for you.</p>
      
      {renderProgressBar()}
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="section-container">
        <h2>{currentSection.title}</h2>
        <p className="section-description">{currentSection.description}</p>
        
        <form onSubmit={handleSubmit}>
          {currentSectionQuestions.map((question) => (
            <div key={question.id} className="question-item">
              <h3>
                {question.text}
                {question.required && <span className="required-marker">*</span>}
              </h3>
              {renderQuestion(question)}
            </div>
          ))}
          
          <div className="navigation-buttons">
            <button
              type="button"
              onClick={goToPreviousSection}
              disabled={currentSectionIndex === 0 || submitting}
              className="previous-button"
            >
              Previous
            </button>
            
            {currentSectionIndex < sections.length - 1 ? (
              <button
                type="button"
                onClick={goToNextSection}
                disabled={submitting}
                className="next-button"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="submit-button"
              >
                {submitting ? 'Submitting...' : 'Submit Answers'}
              </button>
            )}
          </div>
        </form>
      </div>
      
      {renderSectionNavigation()}
    </div>
  );
};

export default QuestionnairePage; 