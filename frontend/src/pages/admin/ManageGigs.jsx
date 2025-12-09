import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { initializeLocalStorage, getGigs, deleteGig } from '../../utils/localStorage'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Tag,
  Shield,
  Zap
} from 'lucide-react'

export default function ManageGigs() {
  const [filter, setFilter] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Get gigs from localStorage so all client-posted jobs are visible
  const gigs = useMemo(() => {
    initializeLocalStorage()
    return getGigs()
  }, [refreshKey])

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = [...new Set(gigs.map(g => g.category))]
    return cats.sort()
  }, [gigs])

  const filteredGigs = gigs.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(filter.toLowerCase()) ||
                         g.category.toLowerCase().includes(filter.toLowerCase()) ||
                         g.shortDesc.toLowerCase().includes(filter.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || g.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDelete = (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      deleteGig(gigId)
      setRefreshKey(prev => prev + 1)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'open': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'closed': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-amber-500" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700'
      case 'closed': return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700'
      default: return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-700'
    }
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 p-8 text-white shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-white/90" />
            </motion.div>
            <h1 className="text-3xl font-bold">Content Moderation</h1>
          </div>
          <p className="text-white/80 text-lg max-w-xl">
            Review, approve, or remove job posts submitted by users.
          </p>
          
          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-200" />
              <span className="text-white/90">{gigs.length} Total Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-200" />
              <span className="text-white/90">{gigs.filter(g => g.status === 'open').length} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
              <span className="text-white/90">{filteredGigs.length} Filtered</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search job posts..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        {filteredGigs.map((gig) => (
          <Card key={gig.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{gig.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {gig.shortDesc}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    {gig.category}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    {gig.location}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    ₱{gig.pay.toLocaleString()}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${gig.status === 'open'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {gig.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Review
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(gig.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

