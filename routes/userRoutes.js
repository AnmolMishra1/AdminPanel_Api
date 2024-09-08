const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.createUser);
router.get('/', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.getUsers);
router.get('/:id', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.getUserById);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.softDeleteUser);
router.delete('/permanent/:id', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.permanentDeleteUser);
router.patch('/restore/:id', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.restoreUser);


module.exports = router;
