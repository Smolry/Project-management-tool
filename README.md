# Project Management Tool - Structure Overview

## Project Description
A full-stack project management application that allows users to:

* Create and manage personal/team projects
* Track tasks and assignments
* Collaborate with team members
* Monitor project progress
* Join projects via invite codes
* Manage user profiles

## Technical Stack

* Frontend: React + Vite
* Backend: Node.js + Express
* Database: MongoDB + Auth0(User data for separtion of concern)
* Authentication: Auth0

## Project Structure
### Backend (backend)
```
backend/
├── config/
│   └── db.js          # MongoDB connection setup
├── models/
│   ├── User.js        # User schema with Auth0 integration
│   ├── Project.js     # Project schema with owner/members
│   ├── Task.js        # Task schema with assignments
│   └── Invite.js      # Invite system for team projects
├── server.js          # Express server & API routes
└── .env              # Environment variables
```

### Frontend (frontend)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx    # Main user dashboard
│   │   ├── Projects.jsx     # Project management
│   │   ├── Tasks.jsx        # Task overview
│   │   └── ProjectDetails.jsx # Individual project view
│   ├── Routes/
│   │   ├── PrivateRoute.jsx # Auth protection
│   │   └── AccessRoute.jsx  # Project access control
│   ├── App.jsx             # Route definitions
│   └── main.jsx           # App entry point
└── .env                   # Frontend configuration
```
## Key Features
1. Authentication:
 * Auth0 integration with custom user profiles
2. Project Management:
 * Create personal/team projects
 * Track project progress
 * Manage team members
3. Task System:
 * Create and assign tasks
 * Track task status
 * Task progress visualization
4. Access Control:
 * Role-based access (owner/member)
 * Invite system for team projects
5. Real-time Updates:
 * Project progress tracking
 * Task status updates

The application follows a clear separation of concerns with modular components and RESTful API design.

## Setup Instructions
### Prerequisite
* Node.js (v16 or higher)
* MongoDB Atlas account
* Auth0 account

### Installation instruction
1. Clone the repo
```
git clone https://github.com/Smolry/Project-management-tool.git
cd project_management_tool
``` 
2. Backend setup
```
cd backend
npm install


```
3. Frontend setup
```
cd ../frontend
npm install


```
4. Environment configuration
### MongoDB setup:
1. Create MongoDB Atlas cluster
2. Create database project-management-tool
3. Get connection string and add to [backend/.env].env )

### Auth0 setup:
1. Create Auth0 application
2. Configure callback URLs:
3. Allowed Callback URLs: http://localhost:5173
4. Allowed Logout URLs: http://localhost:5173
5. Get domain and client ID
6. Add to [frontend/.env].env )

Backend ([backend/.env].env ))
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```
Frontend ([frontend/.env].env ))
```
VITE_API_URL=http://localhost:5000
VITE_AUTH0_DOMAIN=your_domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
```

5. Running the Application
### Start Backend
```
cd backend
npm run dev
```
### Start Frontend
```
cd frontend
npm run dev
```
Access the application at: http://localhost:5173

## Api Documentation
### Authentication endpoints
1. ```POST /api/users/me```
 * Purpose: Find or create user
 * Request Body:
    ```
    {
    "sub": "auth0|123",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "url",
    "email_verified": boolean
    }
    ```

2. ```PUT /api/users/me```
 * Purpose: Update user profile
 * Request Body: Same as ```POST /api/users/me```
### Project Endpoints
3. ```POST /api/projects```
 * Purpose: Create new project
 * Request Body:
   ```
   {
   "sub": "auth0|123",
   "name": "Project Name",
   "description": "Project Description",
   "type": "personal|team",
   "status": "active",
   "githubLink": "url",
   "deploymentUrl": "url",
   "environmentNotes": "notes",
   "members": ["member@email.com"]
   }
   ```

4.``` POST /api/projects/me```
 * Purpose: Get all projects owned by user
 * Request Body:
   ```
   {
   "sub": "auth0|123"
   }
   ```

5. ```GET /api/projects/:id```
 * Purpose: Get project details with populated owner and members
 * URL Parameters: id (project ID)
6. ```POST /api/projects/join```
 * Purpose: Join project using invite code
 * Request Body:
```
{
  "code": "inviteCode",
  "sub": "auth0|123"
}
```

### Task Endpoints
7. ```POST /api/projects/:id/tasks```
 * Purpose: Create new task in project
 * URL Parameters: id (project ID)
 * Request Body:
```
{
  "title": "Task Title",
  "assignedTo": "user@email.com"
}
```

8. ```GET /api/projects/:id/tasks```
 * Purpose: Get all tasks for a project
 * URL Parameters: id (project ID)
9. ```DELETE /api/tasks/:id```
 * Purpose: Delete a task
 * URL Parameters: id (task ID)
10. ```GET /api/tasks/assigned/:sub```
 * Purpose: Get tasks assigned to user
 * URL Parameters: sub (user's Auth0 sub)
### Project Progress
11. ```POST /api/projects/progress-batch```
 * Purpose: Get progress for multiple projects
 * Request Body:
```
{
  "projectIds": ["project1Id", "project2Id"]
}
```
### User Management in Projects
12. ```GET /api/projects/:id/tasks/users```
 * Purpose: Get all users associated with a project
 * URL Parameters: id (project ID)

All endpoints return appropriate HTTP status codes:

* 200: Success
* 201: Created
* 400: Bad Request
* 404: Not Found
* 500: Server Error

## Testing
After setup, verify:

* Backend connects to MongoDB
* Frontend connects to backend
* Auth0 login works
* Can create/view projects
* Can manage tasks
