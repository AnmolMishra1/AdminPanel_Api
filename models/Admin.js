const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Admin = sequelize.define('Admin', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },// Foreign key to Role model

});

module.exports = Admin;
