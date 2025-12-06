import { motion } from 'framer-motion'
import Card from '../UI/Card'

export default function StatCard({ title, value, icon: Icon, trend, trendValue, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={className}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {trend && trendValue && (
              <p
                className={`text-xs mt-1 ${
                  trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </p>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

