import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, LogOut, Menu, X, LayoutDashboard, Briefcase, Search, LogIn, UserPlus, Sparkles } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { getNotifications, markNotificationAsRead, initializeSampleNotifications } from '../../utils/notificationManager'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const notificationsRef = useRef(null)

  // Check if user is on a dashboard page (sidebar has logout)
  const isDashboardPage = location.pathname.startsWith('/student/') ||
    location.pathname.startsWith('/client/') ||
    location.pathname.startsWith('/admin/')

  // Initialize notifications on mount or when user changes
  useEffect(() => {
    if (!user?.role) {
      setNotifications([]);
      return;
    }

    // Initialize sample notifications if none exist
    initializeSampleNotifications(user.role);
    
    // Load notifications for current user's role
    const roleNotifications = getNotifications(user.role);
    setNotifications(roleNotifications);
  }, [user?.role]);

  // Listen for notification updates
  useEffect(() => {
    const handleNotificationUpdate = (event) => {
      if (user?.role) {
        const updated = getNotifications(user.role);
        setNotifications(updated);
      }
    };

    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    return () => window.removeEventListener('notificationUpdate', handleNotificationUpdate);
  }, [user?.role]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [notificationsOpen]);

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

  const getNavigationPath = (notification) => {
    const type = notification.type;
    
    if (user?.role === 'student') {
      switch (type) {
        case 'payment':
          return '/student/earnings';
        case 'application':
          return '/student/applications';
        case 'gig':
          return '/student/browse';
        default:
          return null;
      }
    } else if (user?.role === 'client') {
      switch (type) {
        case 'application':
          return '/client/applicants';
        case 'job_completed':
          return '/client/manage-gigs';
        default:
          return null;
      }
    } else if (user?.role === 'admin') {
      switch (type) {
        case 'verification':
          return '/admin/users';
        case 'report':
          return '/admin/gigs';
        default:
          return null;
      }
    }
    
    return null;
  };

  const handleNotificationClick = (notification) => {
    // Mark as read using the notification manager
    markNotificationAsRead(user?.role, notification.id);
    
    // Navigate to the appropriate page
    const path = getNavigationPath(notification);
    if (path) {
      navigate(path);
    }
    
    setNotificationsOpen(false);
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

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
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotificationsOpen(!notificationsOpen);
                    }}
                    className={iconButtonStyles}
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationsOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 border border-gray-100 dark:border-gray-700 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-gray-750 dark:to-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base">Notifications</h3>
                      </div>
                      
                      {/* Content */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors flex items-start gap-3 ${
                                  notification.isUnread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                              >
                                {/* Unread indicator */}
                                {notification.isUnread && (
                                  <div className="flex-shrink-0 mt-1.5">
                                    <div className="h-2.5 w-2.5 bg-blue-500 rounded-full"></div>
                                  </div>
                                )}
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                                    {notification.title}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  {notification.timestamp && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                      {new Date(notification.timestamp).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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

