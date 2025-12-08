import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, User, LogOut, Menu, X, LayoutDashboard, Briefcase, Search, LogIn, UserPlus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Check if user is on a dashboard page (sidebar has logout)
  const isDashboardPage = location.pathname.startsWith('/student/') ||
    location.pathname.startsWith('/client/') ||
    location.pathname.startsWith('/admin/')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'student') return '/student/dashboard'
    if (user.role === 'client') return '/client/dashboard'
    if (user.role === 'admin') return '/admin/dashboard'
    return '/'
  }

  // Common nav link styles with hover animation
  const navLinkStyles = `
    group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
    text-gray-600 dark:text-gray-300 
    hover:text-sky-600 dark:hover:text-sky-400 
    hover:bg-sky-50 dark:hover:bg-sky-900/20
    transition-all duration-300 ease-out
    hover:scale-105 hover:shadow-sm
  `

  // Icon button styles
  const iconButtonStyles = `
    group relative p-2.5 rounded-xl
    text-gray-500 dark:text-gray-400
    hover:text-sky-600 dark:hover:text-sky-400
    hover:bg-gradient-to-br hover:from-sky-50 hover:to-indigo-50 
    dark:hover:from-sky-900/30 dark:hover:to-indigo-900/30
    transition-all duration-300 ease-out
    hover:scale-110 hover:shadow-md hover:shadow-sky-100 dark:hover:shadow-sky-900/30
  `

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-sky-100/50 dark:border-slate-800/50 fixed top-0 left-0 right-0 z-50 h-16 shadow-sm shadow-sky-100/30 dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Unchanged as requested */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">QuickGig</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Dashboard Link */}
                <Link to={getDashboardPath()} className={navLinkStyles}>
                  <LayoutDashboard className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
                  <span>Dashboard</span>
                </Link>

                {/* Browse Gigs Link */}
                <Link
                  to={user.role === 'student' ? '/student/browse' : '/gigs'}
                  className={navLinkStyles}
                >
                  <Search className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Browse Gigs</span>
                </Link>

                {/* Notification Bell */}
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={iconButtonStyles}
                >
                  <Bell className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
                </button>

                {/* Profile Link */}
                <Link to="/profile" className={iconButtonStyles}>
                  <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </Link>

                {/* Logout Button - Only on non-dashboard pages */}
                {!isDashboardPage && (
                  <button
                    onClick={handleLogout}
                    className="group flex items-center gap-2 px-4 py-2 ml-2 rounded-xl font-medium text-sm
                      text-rose-600 dark:text-rose-400
                      bg-rose-50 dark:bg-rose-900/20
                      hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:text-white
                      border border-rose-200 dark:border-rose-800/50
                      hover:border-transparent hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30
                      transition-all duration-300 ease-out hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    <span>Logout</span>
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Browse Gigs - Public */}
                <Link to="/gigs" className={navLinkStyles}>
                  <Briefcase className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
                  <span>Browse Gigs</span>
                </Link>

                {/* Login Button */}
                <Link
                  to="/login"
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                    text-sky-600 dark:text-sky-400
                    bg-sky-50 dark:bg-sky-900/20
                    border border-sky-200 dark:border-sky-800/50
                    hover:bg-sky-100 dark:hover:bg-sky-900/40
                    hover:border-sky-300 dark:hover:border-sky-700
                    hover:shadow-md hover:shadow-sky-100 dark:hover:shadow-sky-900/20
                    transition-all duration-300 ease-out hover:scale-105"
                >
                  <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span>Login</span>
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                    text-white
                    bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500
                    hover:from-sky-600 hover:via-indigo-600 hover:to-purple-600
                    shadow-md shadow-indigo-200 dark:shadow-indigo-900/30
                    hover:shadow-lg hover:shadow-indigo-300 dark:hover:shadow-indigo-800/40
                    transition-all duration-300 ease-out hover:scale-105
                    relative overflow-hidden"
                >
                  <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Sign Up</span>
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 
              hover:bg-sky-50 dark:hover:bg-sky-900/20 
              hover:text-sky-600 dark:hover:text-sky-400
              transition-all duration-300 hover:scale-105"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-2 border-t border-sky-100/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/gigs"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="w-5 h-5" />
                    <span className="font-medium">Browse Gigs</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  {!isDashboardPage && (
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/gigs"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">Browse Gigs</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-sky-500 to-indigo-500 shadow-md transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

