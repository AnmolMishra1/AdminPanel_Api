
const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get audit logs
router.get('/', authMiddleware.verifyToken, authMiddleware.adminOnly, auditLogController.getAuditLogs);

module.exports = router;

