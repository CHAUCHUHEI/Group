// Script to seed database with sample data
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Job, Application, QuestionnaireResponse } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Force sync all models (reset database)
    if (process.env.RESET_DB === 'true') {
      console.log('Resetting database...');
      await sequelize.sync({ force: true });
    }

    // Create sample users
    console.log('Creating sample users...');
    
    // Hash a sample password
    const samplePasswordHash = await bcrypt.hash('password123', 10);
    
    // Admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@alcatraz.com',
      password_hash: samplePasswordHash,
      role: 'admin'
    });
    
    // Recruiter user
    const recruiter = await User.create({
      name: 'Recruiter User',
      email: 'recruiter@alcatraz.com',
      password_hash: samplePasswordHash,
      role: 'recruiter'
    });
    
    // Job seeker user
    const jobSeeker = await User.create({
      name: 'Job Seeker',
      email: 'seeker@example.com',
      password_hash: samplePasswordHash,
      role: 'job_seeker'
    });

    // Create sample jobs
    console.log('Creating sample jobs...');
    const jobs = await Job.bulkCreate([
      {
        title: 'Prison Guard',
        category: 'Security',
        description: 'Responsible for maintaining security within the prison facility.',
        requirements: 'Law enforcement experience, clean criminal record, high school diploma.',
        salary: '45000-55000',
        location: 'Alcatraz Island',
        posted_by: recruiter.id,
        status: 'approved'
      },
      {
        title: 'Prison Warden',
        category: 'Management',
        description: 'Oversee all prison operations and supervise staff.',
        requirements: '10+ years in corrections, Bachelor\'s degree in Criminal Justice.',
        salary: '80000-100000',
        location: 'Alcatraz Island',
        posted_by: admin.id,
        status: 'approved'
      },
      {
        title: 'Maintenance Worker',
        category: 'Facilities',
        description: 'Maintain and repair prison facilities and equipment.',
        requirements: 'Experience in plumbing, electrical, or general maintenance.',
        salary: '35000-45000',
        location: 'Alcatraz Island',
        posted_by: recruiter.id,
        status: 'approved'
      },
      {
        title: 'Kitchen Staff',
        category: 'Food Service',
        description: 'Prepare and serve meals for prisoners and staff.',
        requirements: 'Food handling certification, cooking experience.',
        salary: '30000-40000',
        location: 'Alcatraz Island',
        posted_by: recruiter.id,
        status: 'approved'
      },
      {
        title: 'Administrative Assistant',
        category: 'Administration',
        description: 'Handle administrative tasks for prison operations.',
        requirements: 'Office skills, computer proficiency, discretion.',
        salary: '40000-50000',
        location: 'Alcatraz Island',
        posted_by: admin.id,
        status: 'approved'
      }
    ]);

    // Create a sample application
    console.log('Creating sample application...');
    const application = await Application.create({
      user_id: jobSeeker.id,
      job_id: jobs[0].id,
      cv_url: 'https://example.com/sample_cv.pdf',
      cover_note: 'I am very interested in this position and have experience in security.',
      status: 'submitted'
    });

    // Create a sample questionnaire response
    console.log('Creating sample questionnaire response...');
    const questionnaireResponse = await QuestionnaireResponse.create({
      user_id: jobSeeker.id,
      answers: {
        security_experience: true,
        works_well_with_others: true,
        comfortable_high_stress: true,
        previous_prison_work: false,
        willing_to_relocate: true
      }
    });

    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Check if this script is being run directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding finished.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
} else {
  // Export for use in other scripts
  module.exports = seedDatabase;
} 