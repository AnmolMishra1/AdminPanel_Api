const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const Admin = require('../models/Admin')
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');
const Admin = require('../models/Admin');
// Signup (Create Admin User)
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if an Admin already exists
        const existingAdmin = await Admin.findOne({ where: { roleId: 1 } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ where: { name: 'Admin' } });

        if (!role) return res.status(404).json({ message: 'Role not found' });

        const user = await Admin.create({
            username,
            email,
            password: hashedPassword,
            roleId: role.id,
        });

        res.status(201).json({ message: 'Admin created successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error creating admin', error: err.message });
    }
};

// Register User (Allow Admin to register new users)
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, roleId } = req.body; // Assuming roleId can be passed in the request

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the role exists
        const role = await Role.findOne({ where: { id: roleId } });
        if (!role) return res.status(404).json({ message: 'Role not found' });

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId,
        });
        await AuditLog.create({
            action: 'Admin created a user',
            userId: roleId,
        });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login (User login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.roleId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};
