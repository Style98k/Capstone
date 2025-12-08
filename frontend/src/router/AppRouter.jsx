import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useLocalAuth'
import { mockUsers } from '../data/mockUsers'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import Sidebar from '../components/Layout/Sidebar'

// HeroIcons for sidebar navigation
import {
  HomeIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

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
import Payments from '../pages/client/Payments'

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 flex pt-16">
        {showSidebar && <Sidebar items={sidebarItems} />}
        {/* Content area - leaves room for collapsed sidebar, centered in remaining space */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ease-out ${showSidebar
            ? 'md:ml-[100px]' // Just enough margin for collapsed sidebar + small buffer
            : ''
            }`}
        >
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default function AppRouter() {
  const { user } = useAuth()

  // Sidebar items based on role
  const studentSidebarItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/student/browse', label: 'Browse Gigs', icon: BriefcaseIcon },
    { path: '/student/applications', label: 'My Applications', icon: ClipboardDocumentListIcon },
    { path: '/student/earnings', label: 'My Earnings', icon: CurrencyDollarIcon },
    { path: '/student/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ]

  const clientSidebarItems = [
    { path: '/client/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/client/post-gig', label: 'Post Job', icon: DocumentPlusIcon },
    { path: '/client/manage-gigs', label: 'Manage Gigs', icon: BriefcaseIcon },
    { path: '/client/applicants', label: 'View Applicants', icon: UserGroupIcon },
    { path: '/client/payments', label: 'Payments', icon: CreditCardIcon },
    { path: '/client/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ]

  const adminSidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/admin/users', label: 'Manage Users', icon: UsersIcon },
    { path: '/admin/gigs', label: 'Manage Gigs', icon: DocumentTextIcon },
    { path: '/admin/reports', label: 'Reports', icon: ChartBarIcon },
    { path: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
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
      <Route
        path="/client/payments"
        element={
          <ProtectedRoute requiredRole="client">
            <Layout showSidebar sidebarItems={clientSidebarItems}>
              <Payments />
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

