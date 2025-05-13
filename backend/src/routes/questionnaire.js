// Questionnaire routes
const express = require('express');
const router = express.Router();
const { QuestionnaireResponse, Job } = require('../models');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { Op } = require('sequelize');

// Define the questionnaire questions with sections
const questionnaireSections = [
  {
    id: 'general_eligibility',
    title: 'General Eligibility',
    description: 'Basic eligibility questions for all positions',
    questions: [
      {
        id: 'legal_right_to_work',
        text: 'Do you have the legal right to work in this country?',
        type: 'boolean',
        required: true
      },
      {
        id: 'background_check',
        text: 'Are you willing to undergo a background check?',
        type: 'boolean',
        required: true
      },
      {
        id: 'criminal_offense',
        text: 'Have you ever been convicted of a criminal offense?',
        type: 'boolean',
        required: true
      },
      {
        id: 'secure_environment',
        text: 'Are you comfortable working in a secure or controlled environment?',
        type: 'boolean',
        required: true
      },
      {
        id: 'drivers_license',
        text: 'Do you have a valid driver\'s license?',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'physical_capability',
    title: 'Physical & Medical Capability',
    description: 'Questions about your physical capabilities',
    questions: [
      {
        id: 'physically_demanding',
        text: 'Can you perform physically demanding tasks (running, lifting, agility)?',
        type: 'boolean',
        required: true
      },
      {
        id: 'lift_heavy',
        text: 'Can you lift and carry heavy objects?',
        type: 'boolean',
        required: true
      },
      {
        id: 'stand_long_periods',
        text: 'Can you stand for long periods of time?',
        type: 'boolean',
        required: true
      },
      {
        id: 'distressing_environments',
        text: 'Are you comfortable in distressing environments (e.g., hospitals, prisons)?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Security', 'Medical', 'Maintenance', 'Custodial', 'Logistics']
  },
  {
    id: 'medical_qualifications',
    title: 'Medical & Healthcare Qualifications',
    description: 'Questions about your medical training and experience',
    questions: [
      {
        id: 'medical_qualification',
        text: 'Do you have a medical qualification (e.g., doctor, nurse)?',
        type: 'boolean',
        required: true
      },
      {
        id: 'first_aid',
        text: 'Do you have first aid or emergency medical training?',
        type: 'boolean',
        required: true
      },
      {
        id: 'patient_care',
        text: 'Are you comfortable with bodily fluids or patient care?',
        type: 'boolean',
        required: true
      },
      {
        id: 'transport_patients',
        text: 'Are you willing to help transport patients?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Medical', 'Emergency Response']
  },
  {
    id: 'security_law_enforcement',
    title: 'Security & Law Enforcement',
    description: 'Questions about your security and law enforcement background',
    questions: [
      {
        id: 'security_experience',
        text: 'Do you have law enforcement, military, or security experience?',
        type: 'boolean',
        required: true
      },
      {
        id: 'work_with_offenders',
        text: 'Are you willing to work with offenders?',
        type: 'boolean',
        required: true
      },
      {
        id: 'high_stress',
        text: 'Can you remain calm in high-stress situations?',
        type: 'boolean',
        required: true
      },
      {
        id: 'de_escalation',
        text: 'Do you have training in de-escalation, self-defense, or physical intervention?',
        type: 'boolean',
        required: true
      },
      {
        id: 'conducting_searches',
        text: 'Are you comfortable conducting searches?',
        type: 'boolean',
        required: true
      },
      {
        id: 'writing_reports',
        text: 'Do you have experience writing incident/security reports?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Security', 'Crisis Response', 'Canine']
  },
  {
    id: 'canine_outdoor',
    title: 'Canine & Outdoor Work',
    description: 'Questions about working with dogs and outdoors',
    questions: [
      {
        id: 'dog_handling',
        text: 'Do you have a dog handling license or experience?',
        type: 'boolean',
        required: true
      },
      {
        id: 'working_outdoors',
        text: 'Are you comfortable working outdoors?',
        type: 'boolean',
        required: true
      },
      {
        id: 'security_searches_dogs',
        text: 'Are you willing to participate in security searches with dogs?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Canine']
  },
  {
    id: 'administrative_office',
    title: 'Administrative & Office Work',
    description: 'Questions about your administrative and office skills',
    questions: [
      {
        id: 'it_proficiency',
        text: 'Do you have basic IT proficiency?',
        type: 'boolean',
        required: true
      },
      {
        id: 'confidential_data',
        text: 'Are you experienced in handling confidential data?',
        type: 'boolean',
        required: true
      },
      {
        id: 'hr_payroll_finance',
        text: 'Have you worked in HR, payroll, or finance?',
        type: 'boolean',
        required: true
      },
      {
        id: 'staff_management',
        text: 'Do you have scheduling/staff management experience?',
        type: 'boolean',
        required: true
      },
      {
        id: 'record_keeping',
        text: 'Do you have record-keeping or data entry experience?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Administration', 'Office', 'HR']
  },
  {
    id: 'food_service',
    title: 'Food Service & Catering',
    description: 'Questions about your food service and catering experience',
    questions: [
      {
        id: 'food_hygiene',
        text: 'Do you have kitchen experience and a food hygiene certificate?',
        type: 'boolean',
        required: true
      },
      {
        id: 'large_scale_cooking',
        text: 'Are you comfortable cooking in large-scale environments?',
        type: 'boolean',
        required: true
      },
      {
        id: 'prep_serving_cleaning',
        text: 'Are you willing to assist in prep, serving, and cleaning?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Food Service']
  },
  {
    id: 'cleaning_maintenance',
    title: 'Cleaning & Maintenance',
    description: 'Questions about your cleaning and maintenance experience',
    questions: [
      {
        id: 'janitorial_experience',
        text: 'Do you have janitorial experience with cleaning chemicals?',
        type: 'boolean',
        required: true
      },
      {
        id: 'high_risk_cleaning',
        text: 'Are you comfortable cleaning high-risk areas?',
        type: 'boolean',
        required: true
      },
      {
        id: 'waste_handling',
        text: 'Are you okay with handling waste (hazardous or medical)?',
        type: 'boolean',
        required: true
      },
      {
        id: 'repair_skills',
        text: 'Do you have plumbing, electrical, or repair skills?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Maintenance', 'Custodial', 'Facilities']
  },
  {
    id: 'transport_logistics',
    title: 'Transport & Logistics',
    description: 'Questions about your transportation and logistics experience',
    questions: [
      {
        id: 'commercial_license',
        text: 'Do you have a commercial driver\'s license?',
        type: 'boolean',
        required: true
      },
      {
        id: 'security_healthcare_driving',
        text: 'Do you have experience driving for security or healthcare?',
        type: 'boolean',
        required: true
      },
      {
        id: 'logistics_warehousing',
        text: 'Have you worked in logistics or warehousing?',
        type: 'boolean',
        required: true
      },
      {
        id: 'forklift_warehouse',
        text: 'Can you operate forklifts or warehouse equipment?',
        type: 'boolean',
        required: true
      },
      {
        id: 'inventory_management',
        text: 'Do you have experience managing inventory?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Logistics', 'Warehouse']
  },
  {
    id: 'emergency_response',
    title: 'Emergency & Crisis Response',
    description: 'Questions about your emergency and crisis response experience',
    questions: [
      {
        id: 'paramedic_training',
        text: 'Are you trained as a paramedic or emergency responder?',
        type: 'boolean',
        required: true
      },
      {
        id: 'cpr_certified',
        text: 'Are you CPR/emergency care certified?',
        type: 'boolean',
        required: true
      },
      {
        id: 'fire_safety',
        text: 'Do you have fire safety or evacuation training?',
        type: 'boolean',
        required: true
      },
      {
        id: 'emergency_comfort',
        text: 'Are you comfortable with violent/medical/fire emergencies?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['Emergency Response', 'Fire Safety', 'Crisis Response']
  },
  {
    id: 'soft_skills',
    title: 'Soft Skills & Work Style',
    description: 'Questions about your work preferences and style',
    questions: [
      {
        id: 'team_independent',
        text: 'Do you prefer working in a team or independently?',
        type: 'select',
        options: ['Team', 'Independently', 'No preference'],
        required: true
      },
      {
        id: 'follow_protocols',
        text: 'Are you comfortable following strict protocols and procedures?',
        type: 'boolean',
        required: true
      },
      {
        id: 'adapt_unexpected',
        text: 'Can you adapt to unexpected situations and think on your feet?',
        type: 'boolean',
        required: true
      }
    ],
    appliesTo: ['All']
  },
  {
    id: 'job_preferences',
    title: 'Job Type Preferences',
    description: 'Select the types of work you are interested in',
    questions: [
      {
        id: 'job_interests',
        text: 'Which types of work are you interested in?',
        type: 'multiselect',
        options: [
          'Medical / Healthcare',
          'Security / Law Enforcement',
          'Cleaning / Maintenance',
          'Office / Administrative',
          'Food Service',
          'Logistics / Transport',
          'Rehabilitation / Social Support',
          'Emergency / Crisis Response'
        ],
        required: true
      }
    ]
  },
  {
    id: 'shift_preferences',
    title: 'Shift Preferences',
    description: 'Select your preferred working hours',
    questions: [
      {
        id: 'preferred_shifts',
        text: 'Which shifts are you available to work?',
        type: 'multiselect',
        options: [
          'Standard hours (Mon-Fri, 9am–5pm)',
          'Standard hours with weekend availability',
          'Evening shifts (5pm–12am)',
          'Night shifts (12am–8am)',
          'Rotating shifts (all shifts)'
        ],
        required: true
      }
    ]
  },
  {
    id: 'training_willingness',
    title: 'Training Willingness',
    description: 'Questions about your willingness to undertake training',
    questions: [
      {
        id: 'additional_training',
        text: 'Are you willing to undertake additional training for a role (e.g., first aid, food hygiene, security protocols)?',
        type: 'boolean',
        required: true
      },
      {
        id: 'career_development',
        text: 'Are you interested in long-term career development within the prison system?',
        type: 'boolean',
        required: true
      }
    ]
  }
];

// Flatten questions for the API response
const flattenQuestions = () => {
  const allQuestions = [];
  questionnaireSections.forEach(section => {
    section.questions.forEach(question => {
      allQuestions.push({
        ...question,
        section: section.id
      });
    });
  });
  return allQuestions;
};

// Get questionnaire sections and questions
router.get('/questions', (req, res) => {
  res.json({ 
    sections: questionnaireSections,
    questions: flattenQuestions()
  });
});

// Submit questionnaire answers
router.post('/submit', authenticateUser, authorizeRoles(['job_seeker']), async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    // Check if user already has a questionnaire response
    let response = await QuestionnaireResponse.findOne({
      where: { user_id: req.user.id }
    });

    if (response) {
      // Update existing response
      response.answers = answers;
      await response.save();
    } else {
      // Create new response
      response = await QuestionnaireResponse.create({
        user_id: req.user.id,
        answers
      });
    }

    res.status(201).json({
      message: 'Questionnaire answers submitted successfully',
      response
    });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get questionnaire results with job recommendations
router.get('/results', authenticateUser, authorizeRoles(['job_seeker']), async (req, res) => {
  try {
    // Get the user's questionnaire responses
    const response = await QuestionnaireResponse.findOne({
      where: { user_id: req.user.id }
    });

    if (!response) {
      return res.status(404).json({ error: 'No questionnaire responses found' });
    }

    // Get approved jobs
    const jobs = await Job.findAll({
      where: { status: 'approved' }
    });

    // Enhanced matching algorithm
    const matches = jobs.map(job => {
      const scores = {
        general: 0,
        skills: 0,
        preferences: 0,
        total: 0
      };
      
      const categoryMapping = {
        'Security': ['security_law_enforcement', 'physical_capability'],
        'Medical': ['medical_qualifications', 'physical_capability'],
        'Administration': ['administrative_office'],
        'Food Service': ['food_service'],
        'Facilities': ['cleaning_maintenance', 'physical_capability'],
        'Logistics': ['transport_logistics', 'physical_capability'],
        'Emergency Response': ['emergency_response', 'physical_capability'],
        'Canine': ['canine_outdoor', 'security_law_enforcement']
      };
      
      // Get categories relevant to this job
      const relevantCategories = [];
      Object.entries(categoryMapping).forEach(([category, sectionIds]) => {
        if (job.category.toLowerCase().includes(category.toLowerCase())) {
          relevantCategories.push(...sectionIds);
        }
      });
      
      // If no specific categories match, use all
      const categoriesToCheck = relevantCategories.length > 0 ? 
        relevantCategories : 
        Object.values(categoryMapping).flat();
      
      // Add general eligibility and soft skills - always relevant
      categoriesToCheck.push('general_eligibility', 'soft_skills');
      
      // Remove duplicates
      const uniqueCategories = [...new Set(categoriesToCheck)];
      
      // Count number of questions in relevant categories
      let totalQuestions = 0;
      let answeredCorrectly = 0;
      
      // Process each relevant section
      uniqueCategories.forEach(sectionId => {
        const section = questionnaireSections.find(s => s.id === sectionId);
        if (!section) return;
        
        section.questions.forEach(question => {
          // Skip multiselect questions for now
          if (question.type === 'multiselect') return;
          
          totalQuestions++;
          
          // Check if answer exists and is correct for the job
          const answer = response.answers[question.id];
          
          // Different scoring based on question
          if (question.id === 'legal_right_to_work' && answer === true) {
            answeredCorrectly++;
            scores.general++;
          }
          else if (question.id === 'background_check' && answer === true) {
            answeredCorrectly++;
            scores.general++;
          }
          else if (question.id === 'criminal_offense' && answer === false) {
            answeredCorrectly++;
            scores.general++;
          }
          else if (question.id === 'secure_environment' && answer === true) {
            answeredCorrectly++;
            scores.general++;
          }
          // Security related
          else if (question.id === 'security_experience' && answer === true && 
                   job.category.toLowerCase().includes('security')) {
            answeredCorrectly++;
            scores.skills += 2; // Higher weight for direct match
          }
          // Medical related
          else if (question.id === 'medical_qualification' && answer === true && 
                   job.category.toLowerCase().includes('medical')) {
            answeredCorrectly++;
            scores.skills += 2;
          }
          // For other boolean questions
          else if (answer === true) {
            answeredCorrectly++;
            scores.skills++;
          }
        });
      });
      
      // Check job preferences
      if (response.answers.job_interests && Array.isArray(response.answers.job_interests)) {
        response.answers.job_interests.forEach(interest => {
          if (job.category.toLowerCase().includes(interest.toLowerCase())) {
            scores.preferences += 3; // High weight for job interest match
          }
        });
      }
      
      // Calculate total score
      scores.total = scores.general + scores.skills + scores.preferences;
      
      // Calculate overall match percentage (max possible would be totalQuestions + preference bonus)
      const maxScore = totalQuestions + 3; // Adding max preference score
      const matchPercentage = Math.round((scores.total / maxScore) * 100);
      
      return {
        id: job.id,
        title: job.title,
        category: job.category,
        description: job.description,
        match_score: matchPercentage,
        match_details: {
          general_eligibility: scores.general,
          skills_match: scores.skills,
          preference_match: scores.preferences
        }
      };
    });
    
    // Sort by match score (descending)
    const sortedMatches = matches.sort((a, b) => b.match_score - a.match_score);
    
    res.json({
      jobs: sortedMatches
    });
  } catch (error) {
    console.error('Error getting questionnaire results:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 