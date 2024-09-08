const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Project = sequelize.define('Project', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
    assignedTo: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
});

module.exports = Project;

