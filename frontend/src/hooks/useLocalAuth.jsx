import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      // Check for saved auth token
      const token = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('quickgig_user')

      if (token && savedUser) {
        try {
          // Try to validate token with backend
          if (isOnline) {
            const userData = await authAPI.getProfile()
            setUser(userData)
            localStorage.setItem('quickgig_user', JSON.stringify(userData))
          } else {
            // Offline: use cached user data
            setUser(JSON.parse(savedUser))
          }
          setLoading(false)
          return
        } catch (e) {
          // Token invalid or expired
          if (e.response?.status === 401 || e.response?.status === 403) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('quickgig_user')
          } else {
            // Network error - use cached data
            if (savedUser) {
              setUser(JSON.parse(savedUser))
            }
          }
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [isOnline])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('quickgig_user', JSON.stringify(response.user))
        setUser(response.user)
        return { success: true, user: response.user }
      }
      
      return { success: false, message: 'Login failed' }
    } catch (error) {
      console.error('Login failed:', error.message)
      
      // Return error message from backend
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message }
      }
      
      return { success: false, message: 'Unable to connect to server. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('quickgig_user', JSON.stringify(response.user))
        setUser(response.user)
        return { success: true, user: response.user }
      }
      
      return { success: false, message: 'Registration failed' }
    } catch (error) {
      console.error('Registration failed:', error.message)
      
      // Return error message from backend
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message }
      }
      
      return { success: false, message: 'Unable to connect to server. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('quickgig_user')
    localStorage.removeItem('auth_token')
  }

  const updateUser = async (updates) => {
    const updatedUser = { ...user, ...updates }
    
    try {
      if (user?.id) {
        await authAPI.updateProfile(user.id, updates)
      }
    } catch (error) {
      console.error('Profile update failed:', error.message)
      throw error
    }
    
    // Update local state and cache
    setUser(updatedUser)
    localStorage.setItem('quickgig_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, isOnline }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

