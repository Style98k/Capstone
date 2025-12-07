import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Sidebar({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-0">
      <div
        className="hidden md:block fixed top-16 bottom-0 left-0 z-30"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="absolute inset-y-0 left-0 w-2 cursor-pointer" />

        <motion.aside
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          variants={{
            open: { x: 0, opacity: 1 },
            closed: { x: '-100%', opacity: 0.95 },
          }}
          transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
          className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-lg overflow-y-auto"
        >
          <nav className="p-4 space-y-1">
            {items.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </motion.aside>
      </div>
    </div>
  )
}

