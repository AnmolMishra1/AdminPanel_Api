const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Admin-only access control
exports.adminOnly = async (req, res, next) => {
    try {
        // Find the user by their ID (decoded from the token)
        const user = await User.findByPk(req.user.id);

        // Check if user exists and if they have admin role (assuming roleId of 1 is Admin)
        if (!user || user.roleId !== 1) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Error verifying user role', error: err.message });
    }
};
