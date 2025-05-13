const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const QuestionnaireResponse = require('./QuestionnaireResponse');
const ResumeData = require('./ResumeData');

// Define relationships

// User relationships
User.hasMany(Job, { 
  foreignKey: 'posted_by', 
  as: 'postedJobs' 
});
User.hasMany(Application, { 
  foreignKey: 'user_id', 
  as: 'applications' 
});
User.hasOne(QuestionnaireResponse, { 
  foreignKey: 'user_id', 
  as: 'questionnaireResponse' 
});
User.hasOne(ResumeData, { 
  foreignKey: 'user_id', 
  as: 'resumeData' 
});

// Job relationships
Job.belongsTo(User, { 
  foreignKey: 'posted_by', 
  as: 'postedBy' 
});
Job.hasMany(Application, { 
  foreignKey: 'job_id', 
  as: 'applications' 
});

// Application relationships
Application.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'applicant' 
});
Application.belongsTo(Job, { 
  foreignKey: 'job_id', 
  as: 'job' 
});

// QuestionnaireResponse relationships
QuestionnaireResponse.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

// ResumeData relationships
ResumeData.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'user' 
});

module.exports = {
  User,
  Job,
  Application,
  QuestionnaireResponse,
  ResumeData
}; 