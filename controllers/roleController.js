const User = require('../models/User');
const Role = require('../models/Role');
const AuditLog = require('../models/AuditLog');

// Assign Role to User
exports.assignRoleToUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        // Check if user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if role exists


        // Assign the role to the user
        user.roleId = roleId;
        await user.save();

        // Log the action
        await AuditLog.create({
            action: `Role  assigned to user '${user.username}'`,
            userId: req.user.id // Log the ID of the admin who assigned the role
        });

        res.status(200).json({ message: 'Role assigned successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error assigning role', error: err.message });
    }
};

// Revoke Role from User
exports.revokeRoleFromUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the current role before revocation for audit purposes
        const currentRole = await Role.findByPk(user.roleId);

        // Revoke the user's role by setting it to null or a default role
        user.roleId = 0; // or set to a default role ID
        await user.save();

        // Log the action
        await AuditLog.create({
            action: `Role '${currentRole ? currentRole.name : 'None'}' revoked from user '${user.username}'`,
            userId: req.user.id // Log the ID of the admin who revoked the role
        });

        res.status(200).json({ message: 'Role revoked successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error revoking role', error: err.message });
    }
};
