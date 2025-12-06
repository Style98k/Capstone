import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useLocalAuth'
import { mockUsers } from '../data/mockUsers'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import Sidebar from '../components/Layout/Sidebar'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import VerifyAccount from '../pages/auth/VerifyAccount'

// Student Pages
import StudentDashboard from '../pages/student/Dashboard'
import BrowseGigs from '../pages/student/BrowseGigs'
import MyApplications from '../pages/student/MyApplications'
import MyEarnings from '../pages/student/MyEarnings'
import Messages from '../pages/student/Messages'

// Client Pages
import ClientDashboard from '../pages/client/Dashboard'
import PostGig from '../pages/client/PostGig'
import ClientManageGigs from '../pages/client/ManageGigs'
import ViewApplicants from '../pages/client/ViewApplicants'
import ClientMessages from '../pages/client/Messages'

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import AdminManageGigs from '../pages/admin/ManageGigs'
import Reports from '../pages/admin/Reports'
import Settings from '../pages/admin/Settings'

// Shared Pages
import Home from '../pages/Home'
import GigDetails from '../pages/GigDetails'
import Profile from '../pages/Profile'
import Notifications from '../pages/Notifications'

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, login } = useAuth()
  const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development'

  // Development mode: Auto-login as admin for admin routes
  useEffect(() => {
    if (isDevMode && requiredRole === 'admin' && !user && !loading) {
      const adminUser = mockUsers.find(u => u.role === 'admin')
      if (adminUser) {
        login(adminUser.email, adminUser.password)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredRole, user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Development mode: Allow bypass for admin routes
  if (!user) {
    if (isDevMode && requiredRole === 'admin') {
      // Wait a bit for auto-login to complete
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )
    }
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

// Layout Component
function Layout({ children, showSidebar = false, sidebarItems = [] }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {showSidebar && <Sidebar items={sidebarItems} />}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

export default function AppRouter() {
  const { user } = useAuth()

  // Sidebar items based on role
  const studentSidebarItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: null },
    { path: '/student/browse', label: 'Browse Gigs', icon: null },
    { path: '/student/applications', label: 'My Applications', icon: null },
    { path: '/student/earnings', label: 'My Earnings', icon: null },
    { path: '/student/messages', label: 'Messages', icon: null },
  ]

  const clientSidebarItems = [
    { path: '/client/dashboard', label: 'Dashboard', icon: null },
    { path: '/client/post-gig', label: 'Post Job', icon: null },
    { path: '/client/manage-gigs', label: 'Manage Gigs', icon: null },
    { path: '/client/applicants', label: 'View Applicants', icon: null },
    { path: '/client/messages', label: 'Messages', icon: null },
  ]

  const adminSidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: null },
    { path: '/admin/users', label: 'Manage Users', icon: null },
    { path: '/admin/gigs', label: 'Manage Gigs', icon: null },
    { path: '/admin/reports', label: 'Reports', icon: null },
    { path: '/admin/settings', label: 'Settings', icon: null },
  ]

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate
              to={
                user.role === 'student'
                  ? '/student/dashboard'
                  : user.role === 'client'
                  ? '/client/dashboard'
                  : '/admin/dashboard'
              }
              replace
            />
          )
        }
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" replace />}
      />
      <Route path="/verify/:token" element={<VerifyAccount />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/client"
        element={<Navigate to="/client/dashboard" replace />}
      />
      <Route
        path="/student"
        element={<Navigate to="/student/dashboard" replace />}
      />
      <Route
        path="/gigs"
        element={
          <Layout>
            <BrowseGigs />
          </Layout>
        }
      />
      <Route
        path="/gigs/:id"
        element={
          <Layout>
            <GigDetails />
          </Layout>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout showSidebar sidebarItems={studentSidebarItems}>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/browse"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout showSidebar sidebarItems={studentSidebarItems}>
              <BrowseGigs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/applications"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout showSidebar sidebarItems={studentSidebarItems}>
              <MyApplications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/earnings"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout showSidebar sidebarItems={studentSidebarItems}>
              <MyEarnings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/messages"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout showSidebar sidebarItems={studentSidebarItems}>
              <Messages />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute requiredRole="client">
            <Layout showSidebar sidebarItems={clientSidebarItems}>
              <ClientDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/post-gig"
        element={
          <ProtectedRoute requiredRole="client">
            <Layout showSidebar sidebarItems={clientSidebarItems}>
              <PostGig />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/manage-gigs"
        element={
          <ProtectedRoute requiredRole="client">
            <Layout showSidebar sidebarItems={clientSidebarItems}>
              <ClientManageGigs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/applicants"
        element={
          <ProtectedRoute requiredRole="client">
            <Layout showSidebar sidebarItems={clientSidebarItems}>
              <ViewApplicants />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/messages"
        element={
          <ProtectedRoute requiredRole="client">
            <Layout showSidebar sidebarItems={clientSidebarItems}>
              <ClientMessages />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showSidebar sidebarItems={adminSidebarItems}>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showSidebar sidebarItems={adminSidebarItems}>
              <ManageUsers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gigs"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showSidebar sidebarItems={adminSidebarItems}>
              <AdminManageGigs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showSidebar sidebarItems={adminSidebarItems}>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showSidebar sidebarItems={adminSidebarItems}>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

