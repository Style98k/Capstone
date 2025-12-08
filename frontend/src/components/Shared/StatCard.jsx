import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

// Color variant configurations
const colorVariants = {
  emerald: {
    cardClass: 'stat-card-emerald',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconShadow: 'shadow-emerald-500/40',
    trendUp: 'text-emerald-700 bg-emerald-100',
    trendDown: 'text-red-600 bg-red-100',
    linkColor: 'text-emerald-600 hover:text-emerald-700',
  },
  violet: {
    cardClass: 'stat-card-violet',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    iconShadow: 'shadow-violet-500/40',
    trendUp: 'text-emerald-700 bg-emerald-100',
    trendDown: 'text-red-600 bg-red-100',
    linkColor: 'text-violet-600 hover:text-violet-700',
  },
  amber: {
    cardClass: 'stat-card-amber',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconShadow: 'shadow-amber-500/40',
    trendUp: 'text-emerald-700 bg-emerald-100',
    trendDown: 'text-red-600 bg-red-100',
    linkColor: 'text-amber-600 hover:text-amber-700',
  },
  blue: {
    cardClass: 'stat-card-blue',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    iconShadow: 'shadow-blue-500/40',
    trendUp: 'text-emerald-700 bg-emerald-100',
    trendDown: 'text-red-600 bg-red-100',
    linkColor: 'text-blue-600 hover:text-blue-700',
  },
  rose: {
    cardClass: 'stat-card-rose',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    iconShadow: 'shadow-rose-500/40',
    trendUp: 'text-emerald-700 bg-emerald-100',
    trendDown: 'text-red-600 bg-red-100',
    linkColor: 'text-rose-600 hover:text-rose-700',
  },
  cyan: {
    cardClass: 'stat-card-cyan',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600',
    iconShadow: 'shadow-cyan-500/40',
    trendUp: 'text-emerald-700 bg-emerald-100',
    trendDown: 'text-red-600 bg-red-100',
    linkColor: 'text-cyan-600 hover:text-cyan-700',
  },
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  showLink = true,
  linkText = 'View details',
  onClick,
  className = '',
  delay = 0
}) {
  const variant = colorVariants[color] || colorVariants.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 }
      }}
      className={`group ${className}`}
    >
      <div className={`
        relative overflow-hidden rounded-2xl p-6
        ${variant.cardClass}
        transition-all duration-500 ease-out
        hover:shadow-2xl
        cursor-pointer
      `}
        onClick={onClick}
      >
        {/* Decorative gradient orb */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-2xl 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>

        <div className="relative">
          {/* Header with icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                {title}
              </p>
              <motion.p
                className="text-4xl font-bold text-gray-900"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay * 0.1 + 0.2, duration: 0.4, type: "spring" }}
              >
                {value}
              </motion.p>
            </div>

            {/* Icon container with glow */}
            {Icon && (
              <motion.div
                className={`
                  stat-icon p-4 rounded-2xl
                  ${variant.iconBg}
                  shadow-lg ${variant.iconShadow}
                  group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300
                `}
                whileHover={{ scale: 1.15, rotate: 6 }}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>
            )}
          </div>

          {/* Trend indicator */}
          {trend && trendValue && (
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
            >
              <span className={`
                inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                ${trend === 'up' ? variant.trendUp : variant.trendDown}
              `}>
                {trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {trendValue}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </motion.div>
          )}

          {/* View details link */}
          {showLink && (
            <motion.div
              className={`
                flex items-center gap-2 text-sm font-medium 
                ${variant.linkColor}
                group/link cursor-pointer mt-2
              `}
              whileHover={{ x: 4 }}
            >
              <span>{linkText}</span>
              <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

