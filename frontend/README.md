# ProjectFlow - Modern Project Management Tool

A beautiful, modern project management application built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **Beautiful UI/UX**: Modern gradient design with smooth animations
- **Project Management**: Create and manage personal or team projects
- **Task Tracking**: Assign and track tasks with status updates
- **Team Collaboration**: Invite team members and collaborate
- **Real-time Updates**: See progress and completion rates
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Tech Stack

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Auth0 for authentication
- React Hot Toast for notifications
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Auth0 account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install express cors dotenv mongoose
```

3. Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the backend server:
```bash
node server.js
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
```

4. Start the development server:
```bash
npm run dev
```

## 🎨 Key Features Explained

### Dashboard
- Overview of all projects and tasks
- Quick stats with beautiful cards
- Recent projects and tasks
- Quick action buttons

### Projects
- Create personal or team projects
- Add project details (description, GitHub link, deployment URL)
- Invite team members
- Track project progress

### Tasks
- Create and assign tasks to team members
- Track task status (pending, in-progress, completed)
- Filter tasks by status
- Edit and delete tasks

### Profile
- View and update user information
- Manage account settings

## 🎯 Project Structure

```
improved-project-manager/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── LoadingSpinner.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Projects.jsx
│       │   ├── ProjectDetails.jsx
│       │   ├── Tasks.jsx
│       │   ├── Profile.jsx
│       │   ├── Home.jsx
│       │   └── JoinProject.jsx
│       ├── Routes/
│       │   ├── PrivateRoutes.jsx
│       │   └── AccessRoute.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── backend/
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Project.js
    │   ├── Task.js
    │   └── Invite.js
    └── server.js
```

## 🎨 Design System

### Color Palette
- Primary: Indigo (600-700)
- Secondary: Purple (500-600)
- Accent: Pink (500-600)
- Success: Emerald (500-600)
- Warning: Amber (500-600)
- Danger: Red (500-600)

### Typography
- Primary Font: Outfit
- Code Font: JetBrains Mono

### Components
- Modern card designs with hover effects
- Smooth animations and transitions
- Glass morphism effects
- Gradient backgrounds
- Beautiful form inputs
- Responsive modals

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Authentication

This project uses Auth0 for authentication. Users can:
- Sign up with email
- Log in with social providers
- Secure session management
- Protected routes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by contemporary project management tools
- Design system follows modern UI/UX principles

