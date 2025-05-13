/**
 * Development database setup script
 * This script initializes the SQLite database for development
 */

const { initDatabase } = require('../config/init-db');

console.log('Setting up development database...');

// Initialize database with force=true to reset the database
initDatabase(true)
  .then(() => {
    console.log('Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    process.exit(1);
  }); 