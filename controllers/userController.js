const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');

// Create User (Admin only)
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, roleId } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const role = await Role.findOne({ where: { id: roleId } });
        if (!role) return res.status(404).json({ message: 'Role not found' });

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId: role.id,
        });

        // Log the action
        await AuditLog.create({
            action: `User '${user.username}' created with role '${role.name}'`,
            userId: req.user.id // Log the ID of the admin who created the user
        });

        res.status(201).json({ message: 'User created', user });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

// Get all Users (Admin and Manager only)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { roleId: 1 } });
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Get User by ID (Accessible by all users)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};

// Update User (Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { username, roleId } = req.body;

        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const role = await Role.findOne({ where: { id: roleId } });
        if (!role) return res.status(404).json({ message: 'Role not found' });

        user.username = username;
        await user.save();

        // Log the action
        await AuditLog.create({
            action: `User '${user.username}' updated to '${username}'`,
            userId: req.user.id // Log the ID of the admin who updated the user
        });

        res.status(200).json({ message: 'User updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// Soft Delete User (Admin only)
exports.softDeleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id, roleId: 1 } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update({ deletedAt: new Date() });

        // Log the action
        await AuditLog.create({
            action: `User '${user.username}' soft-deleted`,
            userId: req.user.id // Log the ID of the admin who soft-deleted the user
        });

        res.status(200).json({ message: 'User soft-deleted', user });
    } catch (err) {
        res.status(500).json({ message: 'Error soft-deleting user', error: err.message });
    }
};

// Permanently Delete User (Admin only)
exports.permanentDeleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy(); // Permanently delete the user

        // Log the action
        await AuditLog.create({
            action: `User '${user.username}' permanently deleted`,
            userId: req.user.id // Log the ID of the admin who permanently deleted the user
        });

        res.status(200).json({ message: 'User permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error permanently deleting user', error: err.message });
    }
};

// Restore User (Admin only)
exports.restoreUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.update({ deletedAt: null });

        // Log the action
        await AuditLog.create({
            action: `User '${user.username}' restored`,
            userId: req.user.id // Log the ID of the admin who restored the user
        });

        res.status(200).json({ message: 'User restored', user });
    } catch (err) {
        res.status(500).json({ message: 'Error restoring user', error: err.message });
    }
};
