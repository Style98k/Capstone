import { motion } from 'framer-motion'
import { MapPin, Clock, Coins, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../UI/Card'

export default function GigCard({ gig, showActions = true }) {
  return (
    <Card hover className="flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {gig.title}
          </h3>
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded">
            {gig.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {gig.shortDesc}
        </p>
        
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{gig.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{gig.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4" />
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              ₱{gig.pay.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      {showActions && (
        <Link
          to={`/gigs/${gig.id}`}
          className="flex items-center justify-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-sm transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </Card>
  )
}

