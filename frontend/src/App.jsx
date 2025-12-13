import { BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './hooks/useLocalAuth'

function App() {
  useEffect(() => {
    // Clear stale localStorage on app load if needed
    const hasToken = localStorage.getItem('auth_token')
    const hasUser = localStorage.getItem('quickgig_user')
    
    // If we have user but no token, clear the user (logout state)
    if (!hasToken && hasUser) {
      localStorage.removeItem('quickgig_user')
    }
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

