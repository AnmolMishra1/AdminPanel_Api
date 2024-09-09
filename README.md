# Admin Panel API

This is a backend API built with Node.js and Express for managing an Admin Panel with role-based access. It features authentication, role management, project management, user management, and audit logging functionalities. The API supports multiple user roles such as Admin, Manager, and Employee, with varying permissions for accessing different endpoints.

## Features

- **User Authentication**: Secure signup and login using JWT tokens.
- **Role-based Access**: Admin, Manager, and Employee roles with distinct permissions.
- **Project Management**: Create, update, delete, and restore projects with assigned users.
- **User Management**: Manage users by assigning and revoking roles.
- **Audit Logging**: Track key actions within the system, such as user creation, project modifications, and role changes.

## Technologies Used

- Node.js
- Express.js
- Sequelize ORM (with PostgreSQL)
- JWT for authentication
- bcryptjs for password hashing

## Installation

1. **Clone the Repository:**

```bash
git clone https://github.com/AnmolMishra1/admin-panel-api.git
cd admin-panel-api
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Create a `.env` file** in the root directory and add the following variables:

```bash
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

4. **Run Migrations** (if using Sequelize migrations):

```bash
npx sequelize-cli db:migrate
```

5. **Start the Application:**

```bash
npm start
```

The server will start at `http://localhost:5000`.

## API Endpoints

### Authentication

- **Signup (Admin Only)**
  - `POST /auth/signup`
  - Create an Admin user. Only one Admin can exist.
  
- **Login**
  - `POST /auth/login`
  - Authenticate user and receive JWT token.

### User Management

- **Create User (Admin Only)**
  - `POST /users`
  - Create a new user with role assignment.

- **Get All Users (Admin and Manager Only)**
  - `GET /users`
  - Fetch all users with role-based filtering.

- **Get User by ID**
  - `GET /users/:id`
  - Fetch details of a specific user.

- **Update User (Admin Only)**
  - `PUT /users/:id`
  - Update user details.

- **Soft Delete User (Admin Only)**
  - `DELETE /users/:id/soft-delete`
  - Soft delete a user.

- **Permanently Delete User (Admin Only)**
  - `DELETE /users/:id/permanent-delete`
  - Permanently delete a user.

- **Restore User (Admin Only)**
  - `POST /users/:id/restore`
  - Restore a soft-deleted user.

### Role Management

- **Assign Role to User (Admin Only)**
  - `POST /users/:id/assign-role`
  - Assign a role to a user.

- **Revoke Role from User (Admin Only)**
  - `POST /users/:id/revoke-role`
  - Revoke a user's role.

### Project Management

- **Create Project (Admin Only)**
  - `POST /projects`
  - Create a new project and assign users.

- **Get All Projects**
  - `GET /projects`
  - Fetch all projects with role-based filtering.

- **Get Project by ID**
  - `GET /projects/:id`
  - Fetch a specific project.

- **Update Project (Admin Only)**
  - `PUT /projects/:id`
  - Update project details.

- **Soft Delete Project (Admin Only)**
  - `DELETE /projects/:id/soft-delete`
  - Soft delete a project.

- **Restore Project (Admin Only)**
  - `POST /projects/:id/restore`
  - Restore a soft-deleted project.

- **Permanently Delete Project (Admin Only)**
  - `DELETE /projects/:id/permanent-delete`
  - Permanently delete a project.

### Audit Logs

- **Get Audit Logs (Admin Only)**
  - `GET /audit-logs`
  - Fetch a list of all audit logs.

## Testing

You can test the API using tools like Postman or Insomnia. Here's how you can do that:

1. **Login**: Get a JWT token by logging in as a user.
2. **Authorization**: For all routes requiring authentication, add the following header to your requests:

```
Authorization: Bearer <JWT_TOKEN>
```

## Error Handling

The API includes comprehensive error handling for all endpoints. Each error response includes a status code and message.

## Contribution

Feel free to submit pull requests or open issues if you find any bugs or want to contribute to improving the project.

## License

This project is licensed under the MIT License.

