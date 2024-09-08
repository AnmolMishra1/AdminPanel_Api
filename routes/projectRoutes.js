const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes for Project Management
router.post('/', authMiddleware.verifyToken, projectController.createProject);
router.get('/', authMiddleware.verifyToken, projectController.getProjects);
router.get('/:id', authMiddleware.verifyToken, projectController.getProjectById);
router.put('/:id', authMiddleware.verifyToken, projectController.updateProject);
router.delete('/:id', authMiddleware.verifyToken, projectController.softDeleteProject);
router.patch('/restore/:id', authMiddleware.verifyToken, projectController.restoreProject);
router.delete('/permanent/:id', authMiddleware.verifyToken, projectController.permanentDeleteProject);

module.exports = router;

