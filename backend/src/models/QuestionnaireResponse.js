const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuestionnaireResponse = sequelize.define('QuestionnaireResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'questionnaire_responses',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (response) => {
      response.updated_at = new Date();
    }
  }
});

module.exports = QuestionnaireResponse; 