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

## Testing
After setup, verify:

* Backend connects to MongoDB
* Frontend connects to backend
* Auth0 login works
* Can create/view projects
* Can manage tasks
