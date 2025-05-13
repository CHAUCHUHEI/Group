# Questionnaire Feature

This directory contains components for the comprehensive job matching questionnaire, which helps match job seekers with appropriate prison job opportunities based on skills, preferences, and eligibility.

## Components

### QuestionnairePage.jsx
A multi-step, section-based questionnaire form with the following features:
- Progressive sections based on the questionnaire schema
- Section-by-section validation
- Progress tracking and visualization
- Support for multiple question types:
  - Boolean (yes/no)
  - Select (single choice)
  - Multiselect (multiple choices)
- Responsive design for mobile and desktop
- Error handling and validation feedback

### QuestionnaireResults.jsx
Displays personalized job recommendations based on questionnaire responses with:
- Match score visualization for overall job fit
- Detailed breakdown of matches by category:
  - General Eligibility
  - Skills Match
  - Preference Match
- Interactive job selection
- Job descriptions and details
- Quick navigation to apply for jobs

### CSS Files
- **Questionnaire.css**: Styles for the questionnaire form
- **QuestionnaireResults.css**: Styles for the results display

## Implementation Details

### State Management
- Section-based navigation with completed section tracking
- Form validation before proceeding to next section
- Answer state maintained throughout the questionnaire
- Progress calculation based on completed sections

### Question Types
- **Boolean**: Yes/No radio buttons
- **Select**: Dropdown selection from options
- **Multiselect**: Checkbox selection for multiple options

### Matching Algorithm
The matching algorithm in the backend evaluates responses across several domains:
1. General eligibility (legal requirements, background checks)
2. Skills match (specific job-related skills)
3. Preference match (candidate's job category preferences)

## Usage Flow
1. User accesses the questionnaire page
2. User completes each section, validated as they progress
3. After submission, user is redirected to results page
4. Results page displays matched jobs with compatibility scores
5. User can select jobs to view details and apply directly

## Service Integration
The questionnaire integrates with the following services:
- **questionnaireService.js**: Handles API calls and utility functions
- **authService.js**: Ensures user authentication
- **jobsService.js**: Retrieves job information

## Future Enhancements
- Question branching based on previous answers
- More sophisticated matching algorithm with weighted scores
- Saved progress for returning to incomplete questionnaires
- Additional question types (slider, rating, etc.) 