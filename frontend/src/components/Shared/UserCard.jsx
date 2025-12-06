import { motion } from 'framer-motion'
import { Star, MapPin, Briefcase } from 'lucide-react'
import Card from '../UI/Card'

export default function UserCard({ user, showActions = false, onAction }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card hover>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
          {getInitials(user.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            {user.role === 'student' && user.rating > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{user.rating}</span>
                <span className="text-gray-500">({user.totalRatings})</span>
              </div>
            )}
          </div>
          
          {user.role === 'student' && (
            <div className="space-y-1">
              {user.schoolId && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  School ID: {user.schoolId}
                </p>
              )}
              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {showActions && onAction && (
          <div className="flex flex-col gap-2">
            {onAction}
          </div>
        )}
      </div>
    </Card>
  )
}

