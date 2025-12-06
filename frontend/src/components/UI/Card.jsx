import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, ...props }) {
  const baseClasses = 'card'
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

