import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'

// Modern color palette for hover effects - each menu item gets a unique color
const hoverColors = [
  { gradient: 'from-blue-500/10 to-cyan-500/10', text: 'text-blue-600', icon: 'text-blue-500', border: 'border-l-blue-500', activeBg: 'from-blue-500/15 to-cyan-500/15' },
  { gradient: 'from-violet-500/10 to-purple-500/10', text: 'text-violet-600', icon: 'text-violet-500', border: 'border-l-violet-500', activeBg: 'from-violet-500/15 to-purple-500/15' },
  { gradient: 'from-emerald-500/10 to-teal-500/10', text: 'text-emerald-600', icon: 'text-emerald-500', border: 'border-l-emerald-500', activeBg: 'from-emerald-500/15 to-teal-500/15' },
  { gradient: 'from-amber-500/10 to-orange-500/10', text: 'text-amber-600', icon: 'text-amber-500', border: 'border-l-amber-500', activeBg: 'from-amber-500/15 to-orange-500/15' },
  { gradient: 'from-rose-500/10 to-pink-500/10', text: 'text-rose-600', icon: 'text-rose-500', border: 'border-l-rose-500', activeBg: 'from-rose-500/15 to-pink-500/15' },
  { gradient: 'from-indigo-500/10 to-blue-500/10', text: 'text-indigo-600', icon: 'text-indigo-500', border: 'border-l-indigo-500', activeBg: 'from-indigo-500/15 to-blue-500/15' },
  { gradient: 'from-cyan-500/10 to-sky-500/10', text: 'text-cyan-600', icon: 'text-cyan-500', border: 'border-l-cyan-500', activeBg: 'from-cyan-500/15 to-sky-500/15' },
]

export default function Sidebar({ items = [] }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  const { user, logout } = useAuth()

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:top-16 md:bottom-0 z-30">
      {/* Sidebar container with glassmorphism effect */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col flex-grow bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-y-auto"
      >
        {/* Navigation Header */}
        <div className="px-4 pt-6 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Navigation
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1.5">
          {items.map((item, index) => {
            const colorScheme = hoverColors[index % hoverColors.length]
            const isHovered = hoveredItem === item.path
            const Icon = item.icon

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <NavLink
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl border-l-4 border-transparent transition-all duration-300 ease-out overflow-hidden ${isActive
                      ? `bg-gradient-to-r ${colorScheme.activeBg} ${colorScheme.text} ${colorScheme.border}`
                      : `text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:${colorScheme.gradient} hover:${colorScheme.text} hover:${colorScheme.border}`
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon with animation */}
                      <motion.span
                        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 ${isActive
                            ? 'bg-white dark:bg-gray-800 shadow-sm'
                            : 'bg-gray-100/80 dark:bg-gray-800/80 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-md'
                          }`}
                        animate={isHovered && !isActive ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {Icon ? (
                          <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive
                              ? colorScheme.icon
                              : `text-gray-400 dark:text-gray-500 group-hover:${colorScheme.icon}`
                            }`} />
                        ) : (
                          <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isActive
                              ? colorScheme.icon.replace('text-', 'bg-')
                              : 'bg-gray-400 dark:bg-gray-500 group-hover:bg-current'
                            }`} />
                        )}
                      </motion.span>

                      {/* Text with slide animation */}
                      <motion.span
                        animate={isHovered && !isActive ? { x: 4 } : { x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 w-2 h-2 rounded-full bg-current"
                        />
                      )}

                      {/* Hover shine effect */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 transition-all duration-300 cursor-pointer"
            >
              {/* Avatar with gradient ring */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg transition-shadow duration-300 hover:shadow-indigo-500/40">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-sm font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {userInitial}
                    </span>
                  </div>
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse" />
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                  {user?.role || 'Member'}
                </p>
              </div>
            </motion.div>

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-rose-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 group"
            >
              <motion.span
                animate={{ x: 0 }}
                whileHover={{ x: -4 }}
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              </motion.span>
              <span>Sign out</span>
            </motion.button>
          </div>
        )}
      </motion.aside>
    </div>
  )
}
