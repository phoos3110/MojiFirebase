import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { toast, Toaster } from 'sonner'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './store/authStore'
import { getFirebaseErrorMessage } from './lib/firebaseErrors'

export default function App() {
  const { isAuthenticated, isInitialized, initialize, profileError } = useAuthStore()

  useEffect(() => initialize(), [initialize])

  useEffect(() => {
    if (profileError) {
      console.error('Không thể tải hồ sơ Firebase:', profileError)
      toast.error(getFirebaseErrorMessage(profileError, 'Không thể tải hồ sơ Firebase.'))
    }
  }, [profileError])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 5, 32, 0.95)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            color: '#f1f0ff',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
          },
          classNames: {
            toast: 'anime-toast',
          },
        }}
        richColors
      />

      {!isInitialized ? (
        <div style={{ minHeight: '100vh' }} />
      ) : (
        <Routes>
          {/* Redirect root */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
          />

          {/* Public */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </>
  )
}
