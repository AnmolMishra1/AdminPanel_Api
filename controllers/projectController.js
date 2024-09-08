const Project = require('../models/Project');
const { Op } = require('sequelize');
const AuditLog = require('../models/AuditLog');

// Create a Project (Admin only)
exports.createProject = async (req, res) => {
    try {
        const { name, description, assignedTo } = req.body;

        const project = await Project.create({
            name,
            description,
            createdBy: 1, // Assuming '1' is the admin ID or you can replace this with req.user.id if needed
            assignedTo: assignedTo || []
        });

        // Log the action
        await AuditLog.create({
            action: `Project '${name}' was created`,
            userId: req.user.id // Log the ID of the user who created the project
        });

        res.status(201).json({ message: 'Project created', project });
    } catch (err) {
        res.status(500).json({ message: 'Error creating project', error: err.message });
    }
};

// Get All Projects (Accessible by all roles, returns projects based on user role)
exports.getProjects = async (req, res) => {
    try {
        let projects;

        // Admin: Can view all projects
        if (req.user.role === 1) {
            projects = await Project.findAll();
        }
        // Manager: Can view projects assigned to them
        else if (req.user.role === 'Manager') {
            projects = await Project.findAll({ where: { assignedTo: req.user.id } });
        }
        // Employee: Can view only the projects assigned to them
        else if (req.user.role === 'Employee') {
            projects = await Project.findAll({ where: { assignedTo: req.user.id } });
        }

        res.status(200).json({ projects });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects', error: err.message });
    }
};

// Get Project by ID (Accessible by all roles, but restricted by role)
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findOne({ where: { id } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Authorization check based on role
        if (req.user.role === 'Manager' && !project.assignedTo.includes(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.user.role === 'Employee' && !project.assignedTo.includes(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json({ project });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project', error: err.message });
    }
};

// Update Project (Admin only)
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await Project.findOne({ where: { id } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only Admin can update project
        if (req.user.role !== 1) {
            return res.status(403).json({ message: 'Access denied' });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        await project.save();

        // Log the action
        await AuditLog.create({
            action: `Project '${project.name}' was updated`,
            userId: req.user.id
        });

        res.status(200).json({ message: 'Project updated', project });
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err.message });
    }
};

// Soft Delete Project (Admin only)
exports.softDeleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findOne({ where: { id } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only Admin can soft delete a project
        if (req.user.role !== 1) {
            return res.status(403).json({ message: 'Access denied' });
        }

        project.deletedAt = new Date();
        await project.save();

        // Log the action
        await AuditLog.create({
            action: `Project '${project.name}' was soft deleted`,
            userId: req.user.id
        });

        res.status(200).json({ message: 'Project soft deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting project', error: err.message });
    }
};

// Restore Soft-Deleted Project (Admin only)
exports.restoreProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findOne({ where: { id, deletedAt: { [Op.ne]: null } } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or not soft-deleted' });
        }

        // Only Admin can restore a soft-deleted project
        if (req.user.role !== 1) {
            return res.status(403).json({ message: 'Access denied' });
        }

        project.deletedAt = null;
        await project.save();

        // Log the action
        await AuditLog.create({
            action: `Project '${project.name}' was restored`,
            userId: req.user.id
        });

        res.status(200).json({ message: 'Project restored' });
    } catch (err) {
        res.status(500).json({ message: 'Error restoring project', error: err.message });
    }
};

// Permanently Delete Project (Admin only)
exports.permanentDeleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findOne({ where: { id } });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only Admin can permanently delete a project
        if (req.user.role !== 1) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await project.destroy();

        // Log the action
        await AuditLog.create({
            action: `Project '${project.name}' was permanently deleted`,
            userId: req.user.id
        });

        res.status(200).json({ message: 'Project permanently deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting project', error: err.message });
    }
};
