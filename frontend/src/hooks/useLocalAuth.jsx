import { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockUsers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('quickgig_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('quickgig_user')
      }
    }
    
    // Development mode: Auto-login as admin if accessing admin routes
    const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development'
    const isAdminRoute = window.location.pathname.startsWith('/admin')
    
    if (isDevMode && isAdminRoute) {
      const adminUser = mockUsers.find(u => u.role === 'admin')
      if (adminUser) {
        const { password: _, ...userWithoutPassword } = adminUser
        setUser(userWithoutPassword)
        localStorage.setItem('quickgig_user', JSON.stringify(userWithoutPassword))
      }
    }
    
    setLoading(false)
  }, [])


  const login = (email, password) => {
    const foundUser = mockUsers.find(
      u => (u.email === email || u.schoolId === email) && u.password === password
    )
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('quickgig_user', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }
    
    return { success: false, message: 'Invalid credentials' }
  }

  const register = (userData) => {
    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      verified: userData.role === 'admin',
      createdAt: new Date().toISOString(),
    }
    
    mockUsers.push(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('quickgig_user', JSON.stringify(userWithoutPassword))
    return { success: true, user: userWithoutPassword }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('quickgig_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('quickgig_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
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

