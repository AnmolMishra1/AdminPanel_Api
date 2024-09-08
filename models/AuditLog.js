const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

class AuditLog extends Model { }

AuditLog.init({
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,

    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

}, {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_logs',
    timestamps: false,
});

module.exports = AuditLog;

