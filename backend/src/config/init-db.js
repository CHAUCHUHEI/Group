const { sequelize } = require('./database');
const { User, Job, Application, QuestionnaireResponse, ResumeData } = require('../models');

/**
 * Initializes database by syncing all models
 * @param {boolean} force - If true, drops existing tables (use for development only)
 */
const initDatabase = async (force = false) => {
  try {
    // Sync all models with database
    await sequelize.sync({ force });
    console.log(`Database ${force ? 'reset and ' : ''}synchronized`);

    // If in development mode and tables were reset, seed with initial data
    if (force && process.env.NODE_ENV === 'development') {
      await seedDatabase();
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

/**
 * Seeds database with initial data for development
 */
const seedDatabase = async () => {
  try {
    // Create admin user
    const adminPassword = await User.hashPassword('admin123');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@alcatraz.com',
      password_hash: adminPassword,
      role: 'admin'
    });
    console.log('Admin user created');

    // Create recruiter user
    const recruiterPassword = await User.hashPassword('recruiter123');
    const recruiter = await User.create({
      name: 'Recruiter User',
      email: 'recruiter@alcatraz.com',
      password_hash: recruiterPassword,
      role: 'recruiter'
    });
    console.log('Recruiter user created');

    // Create job seeker user
    const seekerPassword = await User.hashPassword('seeker123');
    const seeker = await User.create({
      name: 'Job Seeker',
      email: 'seeker@example.com',
      password_hash: seekerPassword,
      role: 'job_seeker'
    });
    console.log('Job seeker user created');

    // Create sample jobs
    const jobs = await Job.bulkCreate([
      {
        title: 'Prison Guard',
        category: 'Security',
        description: 'Responsible for maintaining security within the prison facility.',
        requirements: 'Law enforcement experience preferred. Must pass background check.',
        salary: '$45,000 - $60,000',
        location: 'Alcatraz Island',
        posted_by: recruiter.id,
        status: 'approved'
      },
      {
        title: 'Kitchen Staff',
        category: 'Food Service',
        description: 'Prepare meals for prison inmates and staff.',
        requirements: 'Food handling certification required.',
        salary: '$35,000 - $45,000',
        location: 'Alcatraz Island',
        posted_by: recruiter.id,
        status: 'approved'
      },
      {
        title: 'Maintenance Worker',
        category: 'Facilities',
        description: 'Handle repairs and maintenance around the prison facility.',
        requirements: 'Experience with plumbing, electrical, and general repairs.',
        salary: '$40,000 - $50,000',
        location: 'Alcatraz Island',
        posted_by: recruiter.id,
        status: 'pending'
      }
    ]);
    console.log('Sample jobs created');

    // Sample questionnaire response
    await QuestionnaireResponse.create({
      user_id: seeker.id,
      answers: {
        "security_experience": true,
        "works_well_with_others": true,
        "comfortable_high_stress": true,
        "previous_prison_work": false,
        "willing_to_relocate": true
      }
    });
    console.log('Sample questionnaire response created');

    // Sample application
    await Application.create({
      user_id: seeker.id,
      job_id: jobs[0].id,
      cv_url: 'cv_sample.pdf',
      cover_note: 'I am very interested in this position and believe my experience makes me a good fit.',
      status: 'submitted'
    });
    console.log('Sample application created');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = {
  initDatabase,
  seedDatabase
}; 