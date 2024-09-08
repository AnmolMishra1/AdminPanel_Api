const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');

// Assign role to user
router.post('/:id/assign-role', authMiddleware.verifyToken, roleController.assignRoleToUser);

// Revoke role from user
router.post('/:id/revoke-role', authMiddleware.verifyToken, roleController.revokeRoleFromUser);

module.exports = router;
