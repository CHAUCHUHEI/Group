const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_DIALECT === 'postgres' && process.env.DB_URL) {
  // Use PostgreSQL (Render production)
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  console.log('Connected to PostgreSQL (Render)');
} else {
  // Use SQLite (local development)
  const DB_STORAGE = process.env.DB_STORAGE || './database.sqlite';

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_STORAGE,
    logging: process.env.NODE_ENV !== 'production' ? console.log : false
  });
  console.log('Using SQLite database for development');
}

// Test connection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};