const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const auditLogsRoutes = require('./routes/auditLogRoutes');
const roleRoutes = require('./routes/roleRoutes');
const { sequelize } = require('./utils/database');


dotenv.config();
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/project', projectRoutes);
app.use('/audit-logs', auditLogsRoutes);
app.use('/users', roleRoutes);



sequelize.sync({ force: false }).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});

