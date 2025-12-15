import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
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
  UserCircleIcon,
} from '@heroicons/react/24/outline'

// Lazy-loaded pages for faster initial load
const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const VerifyAccount = lazy(() => import('../pages/auth/VerifyAccount'))

const StudentDashboard = lazy(() => import('../pages/student/Dashboard'))
const BrowseGigs = lazy(() => import('../pages/student/BrowseGigs'))
const MyApplications = lazy(() => import('../pages/student/MyApplications'))
const MyEarnings = lazy(() => import('../pages/student/MyEarnings'))
const Messages = lazy(() => import('../pages/student/Messages'))
const ProfileManagement = lazy(() => import('../pages/student/ProfileManagement'))

const ClientDashboard = lazy(() => import('../pages/client/Dashboard'))
const PostGig = lazy(() => import('../pages/client/PostGig'))
const ClientManageGigs = lazy(() => import('../pages/client/ManageGigs'))
const ViewApplicants = lazy(() => import('../pages/client/ViewApplicants'))
const ClientMessages = lazy(() => import('../pages/client/Messages'))
const Payments = lazy(() => import('../pages/client/Payments'))
const ClientProfile = lazy(() => import('../pages/client/ClientProfile'))

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'))
const AdminManageGigs = lazy(() => import('../pages/admin/ManageGigs'))
const Reports = lazy(() => import('../pages/admin/Reports'))
const Settings = lazy(() => import('../pages/admin/Settings'))
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'))

const Home = lazy(() => import('../pages/Home'))
const GigDetails = lazy(() => import('../pages/GigDetails'))
const Profile = lazy(() => import('../pages/Profile'))
const Notifications = lazy(() => import('../pages/Notifications'))

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, login } = useAuth()
  const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development'

  // Development mode: Auto-login as admin for admin routes
  // Development mode auto-login removed to allow logout testing

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Development mode: Allow bypass for admin routes
  if (!user) {
    // Dev mode bypass removed
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

// Layout Component
function Layout({ children, showSidebar = false, sidebarItems = [] }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar
        onMenuClick={showSidebar ? () => setMobileSidebarOpen(!mobileSidebarOpen) : undefined}
      />
      <div className="flex-1 flex pt-16">
        {showSidebar && (
          <Sidebar
            items={sidebarItems}
            mobileOpen={mobileSidebarOpen}
            setMobileOpen={setMobileSidebarOpen}
          />
        )}
        {/* Content area - leaves room for collapsed sidebar, centered in remaining space */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ease-out ${showSidebar
            ? 'md:ml-[60px]' // Margin for collapsed sidebar
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
    { path: '/student/profile', label: 'Profile Management', icon: UserCircleIcon },
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
    { path: '/admin/gigs', label: 'Job Post Review', icon: DocumentTextIcon },
    { path: '/admin/reports', label: 'Reports', icon: ChartBarIcon },
    { path: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
  ]

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading experience…</p>
          </div>
        </div>
      }
    >
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
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout showSidebar sidebarItems={studentSidebarItems}>
                <ProfileManagement />
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

        {/* Admin Profile Route */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout showSidebar sidebarItems={adminSidebarItems}>
                <AdminProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Client Profile Route */}
        <Route
          path="/client/profile"
          element={
            <ProtectedRoute requiredRole="client">
              <Layout showSidebar sidebarItems={clientSidebarItems}>
                <ClientProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Shared Routes - Profile redirects based on role */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navigate
                to={
                  user?.role === 'student'
                    ? '/student/profile'
                    : user?.role === 'client'
                      ? '/client/profile'
                      : user?.role === 'admin'
                        ? '/admin/profile'
                        : '/login'
                }
                replace
              />
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
    </Suspense>
  )
}

