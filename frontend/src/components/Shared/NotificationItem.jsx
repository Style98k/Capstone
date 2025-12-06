import { motion } from 'framer-motion'
import { Bell, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
// Simple date formatter
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export default function NotificationItem({ notification, onMarkAsRead }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatTimeAgo(notification.createdAt)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
          )}
          {onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Mark as read"
            >
              <Check className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

