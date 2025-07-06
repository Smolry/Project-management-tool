// src/App.jsx
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile' 
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Tasks from './pages/Tasks'
import PrivateRoute from './Routes/PrivateRoutes'
import JoinProject from './pages/JoinProject'
import AccessRoute from './Routes/AccessRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/joinproject" element={<JoinProject />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <Projects />
          </PrivateRoute>
        }
      />
      <Route path="/projects/:id" element={
  <AccessRoute>
    <ProjectDetails />
  </AccessRoute>
} />

      <Route
      path="/tasks"
      element={
      <PrivateRoute>
        <Tasks />
        </PrivateRoute>
      }
      />
    </Routes>
  )
}
