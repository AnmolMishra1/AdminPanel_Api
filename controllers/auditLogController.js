const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
    try {
        const auditLogs = await AuditLog.findAll();
        res.status(200).json({ auditLogs });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching audit logs', error: err.message });
    }
};
