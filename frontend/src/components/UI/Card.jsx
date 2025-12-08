import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  glass = false,
  padding = 'p-6',
  gradient = false,
  delay = 0,
  ...props
}) {
  const baseClasses = `
    relative overflow-hidden rounded-2xl 
    ${padding}
    ${glass
      ? 'bg-white/80 backdrop-blur-xl border border-white/20'
      : 'bg-white border border-gray-100/50'
    }
    ${gradient ? 'bg-gradient-to-br from-white to-gray-50/50' : ''}
  `

  const hoverClasses = hover
    ? 'hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300'
    : 'transition-shadow duration-200'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`${baseClasses} ${hoverClasses} ${className} group`}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)'
      }}
      {...props}
    >
      {/* Gradient top border that appears on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-[-100%] w-full h-full 
          bg-gradient-to-r from-transparent via-white/5 to-transparent 
          group-hover:left-[100%] transition-all duration-1000 ease-out" />
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}

