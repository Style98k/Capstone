import { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockUsers'
import { initializeLocalStorage } from '../utils/localStorage'

const AuthContext = createContext(null)

// Helper to get registered users from localStorage
const getRegisteredUsers = () => {
  try {
    const saved = localStorage.getItem('quickgig_registered_users_v2')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    return []
  }
}

// Helper to save a new registered user to localStorage
const saveRegisteredUser = (user) => {
  const registeredUsers = getRegisteredUsers()
  registeredUsers.push(user)
  localStorage.setItem('quickgig_registered_users_v2', JSON.stringify(registeredUsers))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize localStorage with mock data if needed
    initializeLocalStorage()

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


  // Helper to get saved user updates from localStorage
  const getSavedUserUpdates = (userId) => {
    try {
      // Check quickgig_users_v2 for any updates
      const users = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
      const savedUser = users.find(u => u.id === userId)
      if (savedUser) return savedUser

      // Also check registered users
      const registeredUsers = getRegisteredUsers()
      const regUser = registeredUsers.find(u => u.id === userId)
      if (regUser) return regUser

      return null
    } catch {
      return null
    }
  }

  const login = (email, password) => {
    // First check mockUsers (pre-defined users)
    let foundUser = mockUsers.find(
      u => (u.email === email || u.schoolId === email) && u.password === password
    )

    // If not found in mockUsers, check registered users from localStorage
    if (!foundUser) {
      const registeredUsers = getRegisteredUsers()
      foundUser = registeredUsers.find(
        u => (u.email === email || u.schoolId === email) && u.password === password
      )
    }

    if (foundUser) {
      // Check for any saved updates (like profile photo) in localStorage
      const savedUpdates = getSavedUserUpdates(foundUser.id)

      // Merge saved updates with the found user (saved updates take precedence)
      const mergedUser = savedUpdates
        ? { ...foundUser, ...savedUpdates, password: foundUser.password }
        : foundUser

      const { password: _, ...userWithoutPassword } = mergedUser
      setUser(userWithoutPassword)
      localStorage.setItem('quickgig_user', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }

    return { success: false, message: 'Invalid credentials' }
  }

  const register = (userData) => {
    // Check if email already exists in mockUsers or registered users
    const existingMock = mockUsers.find(u => u.email === userData.email)
    const registeredUsers = getRegisteredUsers()
    const existingRegistered = registeredUsers.find(u => u.email === userData.email)

    if (existingMock || existingRegistered) {
      return { success: false, message: 'Email already registered' }
    }

    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      verified: userData.role === 'admin',
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage for persistence across page refreshes
    saveRegisteredUser(newUser)

    // Also save to quickgig_users_v2 for dynamic homepage counter updates
    const existingUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
    existingUsers.push(newUser)
    localStorage.setItem('quickgig_users_v2', JSON.stringify(existingUsers))
    // Dispatch storage event for immediate UI updates across tabs/components
    window.dispatchEvent(new Event('storage'))

    // Also push to mockUsers for current session
    mockUsers.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('quickgig_user', JSON.stringify(userWithoutPassword))

    // Reset verification statuses for new student signups
    if (userData.role === 'student') {
      localStorage.setItem('verificationStatus', 'unverified')
      localStorage.setItem('assessmentStatus', 'unverified')
      localStorage.setItem('phoneVerified', 'false')
      // Clear any leftover uploaded documents from previous sessions
      localStorage.removeItem('studentIDImage')
      localStorage.removeItem('studentAssessmentImage')
      localStorage.removeItem('studentNotification')
    }

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

    // Also update in registered users array for sync across the site
    const registeredUsers = getRegisteredUsers()
    const regIndex = registeredUsers.findIndex(u => u.id === user.id)
    if (regIndex !== -1) {
      registeredUsers[regIndex] = { ...registeredUsers[regIndex], ...updates }
      localStorage.setItem('quickgig_registered_users_v2', JSON.stringify(registeredUsers))
    }

    // Also update in quickgig_users_v2 for admin user management
    const users = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      // User exists, update them
      users[userIndex] = { ...users[userIndex], ...updates }
    } else {
      // User doesn't exist in localStorage (mock user), add them with updates
      users.push({ ...user, ...updates })
    }
    localStorage.setItem('quickgig_users_v2', JSON.stringify(users))

    // Dispatch storage event for immediate UI updates
    window.dispatchEvent(new Event('storage'))
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

