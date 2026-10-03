import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}
