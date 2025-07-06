// src/components/PrivateRoute.jsx
import { useAuth0 } from '@auth0/auth0-react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    loginWithRedirect()
    return null
  }

  return children
}
