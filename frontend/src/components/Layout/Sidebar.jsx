import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'

// Modern color palette for hover effects - each menu item gets a unique color
const hoverColors = [
  { gradient: 'from-blue-500/10 to-cyan-500/10', text: 'text-blue-600', icon: 'text-blue-500', border: 'border-l-blue-500', activeBg: 'from-blue-500/15 to-cyan-500/15', iconActive: 'bg-blue-500' },
  { gradient: 'from-violet-500/10 to-purple-500/10', text: 'text-violet-600', icon: 'text-violet-500', border: 'border-l-violet-500', activeBg: 'from-violet-500/15 to-purple-500/15', iconActive: 'bg-violet-500' },
  { gradient: 'from-emerald-500/10 to-teal-500/10', text: 'text-emerald-600', icon: 'text-emerald-500', border: 'border-l-emerald-500', activeBg: 'from-emerald-500/15 to-teal-500/15', iconActive: 'bg-emerald-500' },
  { gradient: 'from-amber-500/10 to-orange-500/10', text: 'text-amber-600', icon: 'text-amber-500', border: 'border-l-amber-500', activeBg: 'from-amber-500/15 to-orange-500/15', iconActive: 'bg-amber-500' },
  { gradient: 'from-rose-500/10 to-pink-500/10', text: 'text-rose-600', icon: 'text-rose-500', border: 'border-l-rose-500', activeBg: 'from-rose-500/15 to-pink-500/15', iconActive: 'bg-rose-500' },
  { gradient: 'from-indigo-500/10 to-blue-500/10', text: 'text-indigo-600', icon: 'text-indigo-500', border: 'border-l-indigo-500', activeBg: 'from-indigo-500/15 to-blue-500/15', iconActive: 'bg-indigo-500' },
  { gradient: 'from-cyan-500/10 to-sky-500/10', text: 'text-cyan-600', icon: 'text-cyan-500', border: 'border-l-cyan-500', activeBg: 'from-cyan-500/15 to-sky-500/15', iconActive: 'bg-cyan-500' },
]

// Collapsed width (just icons) and expanded width
export const COLLAPSED_WIDTH = 80
export const EXPANDED_WIDTH = 288

export default function Sidebar({ items = [], onExpandChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
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

  const handleMouseEnter = () => {
    setIsExpanded(true)
    onExpandChange?.(true)
  }

  const handleMouseLeave = () => {
    setIsExpanded(false)
    onExpandChange?.(false)
  }

  return (
    <motion.div
      className="hidden md:flex md:flex-col md:fixed md:top-16 md:bottom-0 md:left-0 z-40"
      initial={false}
      animate={{ width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sidebar container with glassmorphism effect */}
      <motion.aside
        className="flex flex-col flex-grow bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden"
        animate={{
          boxShadow: isExpanded
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Navigation Header - Only show when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="px-4 pt-6 pb-2"
            >
              <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Navigation
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Items */}
        <nav className={`flex-1 py-4 space-y-2 ${isExpanded ? 'px-3' : 'px-2'}`}>
          {items.map((item, index) => {
            const colorScheme = hoverColors[index % hoverColors.length]
            const isHovered = hoveredItem === item.path
            const Icon = item.icon

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className="relative"
              >
                <NavLink
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={({ isActive }) =>
                    `group relative flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center px-0'} py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out overflow-hidden ${isActive
                      ? `bg-gradient-to-r ${colorScheme.activeBg} ${colorScheme.text} ${isExpanded ? colorScheme.border + ' border-l-4' : ''}`
                      : `text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:${colorScheme.gradient} hover:${colorScheme.text}`
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon with animation */}
                      <motion.span
                        className={`flex items-center justify-center rounded-xl transition-all duration-300 ${isExpanded ? 'w-10 h-10' : 'w-12 h-12'
                          } ${isActive
                            ? `${colorScheme.iconActive} shadow-lg`
                            : 'bg-gray-100/80 dark:bg-gray-800/80 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-lg'
                          }`}
                        animate={isHovered && !isActive ? { scale: 1.08, rotate: 3 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {Icon && (
                          <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive
                            ? 'text-white'
                            : `text-gray-500 dark:text-gray-400 group-hover:${colorScheme.icon}`
                            }`} />
                        )}
                      </motion.span>

                      {/* Text - Only show when expanded */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: isHovered && !isActive ? 4 : 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Active indicator dot - Only when expanded */}
                      {isActive && isExpanded && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 w-2 h-2 rounded-full bg-current"
                        />
                      )}

                      {/* Hover shine effect */}
                      <AnimatePresence>
                        {isHovered && isExpanded && (
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

                {/* Tooltip when collapsed */}
                <AnimatePresence>
                  {!isExpanded && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -5, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50"
                    >
                      <div className={`px-3 py-2 rounded-lg shadow-xl text-sm font-medium whitespace-nowrap ${colorScheme.text} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
                        {item.label}
                        {/* Arrow */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700 rotate-45" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className={`border-t border-gray-100 dark:border-gray-700/50 ${isExpanded ? 'p-4' : 'p-2 py-4'}`}>
            {isExpanded ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 transition-all duration-300 cursor-pointer"
                >
                  {/* Avatar with gradient ring */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-sm font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {userInitial}
                        </span>
                      </div>
                    </div>
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
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-rose-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300"
                >
                  <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                  <span>Sign out</span>
                </motion.button>
              </>
            ) : (
              /* Collapsed state - just show avatar and logout icon */
              <div className="flex flex-col items-center gap-3">
                {/* Avatar */}
                <div className="relative group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
                    <div className="w-full h-full rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-sm font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {userInitial}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse" />
                </div>

                {/* Logout button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-rose-500/10 hover:text-red-500 transition-all duration-300"
                  title="Sign out"
                >
                  <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </motion.aside>
    </motion.div>
  )
}
