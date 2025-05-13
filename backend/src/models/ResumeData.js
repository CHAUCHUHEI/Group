const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ResumeData = sequelize.define('ResumeData', {
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
  skills: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('skills');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value || []));
    }
  },
  experience: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  parsed_data: {
    type: DataTypes.JSON,
    allowNull: true
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
  tableName: 'resume_data',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (data) => {
      data.updated_at = new Date();
    }
  }
});

module.exports = ResumeData; 