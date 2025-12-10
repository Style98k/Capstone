import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { initializeLocalStorage, getGigs, deleteGig, updateGig } from '../../utils/localStorage'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import Modal from '../../components/UI/Modal'
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
  Tag,
  Shield,
  Zap,
  AlarmClock,
  AlertOctagon,
  Sparkles
} from 'lucide-react'

const PhilippinePeso = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M7 21V4" />
    <path d="M7 4h5a5 5 0 0 1 0 10h-5" />
    <path d="M5 7h14" />
    <path d="M5 10h13" />
  </svg>
)

export default function ManageGigs() {
  const [filter, setFilter] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGig, setSelectedGig] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteMode, setDeleteMode] = useState('immediate')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Get gigs from localStorage so all client-posted jobs are visible
  const gigs = useMemo(() => {
    initializeLocalStorage()
    const stored = getGigs()

    // Auto-remove anything that passed a scheduled removal window
    const now = Date.now()
    const expiredIds = stored
      .filter(g => g.scheduledRemovalAt && new Date(g.scheduledRemovalAt).getTime() <= now)
      .map(g => g.id)

    if (expiredIds.length) {
      expiredIds.forEach(id => deleteGig(id))
      return getGigs()
    }

    return stored
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

  const handleDeleteClick = (gig) => {
    setDeleteTarget(gig)
    setDeleteMode('immediate')
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    if (deleteMode === 'scheduled') {
      updateGig(deleteTarget.id, {
        scheduledRemovalAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        moderationNote: 'Scheduled for removal after 24h review window',
      })
    } else {
      deleteGig(deleteTarget.id)
    }

    setRefreshKey(prev => prev + 1)
    setShowDeleteModal(false)
    setDeleteTarget(null)
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
    switch (status) {
      case 'open': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'closed': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-amber-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{gig.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(gig.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(gig.status)}
                      <span className="capitalize">{gig.status}</span>
                    </div>
                  </div>
                  {gig.scheduledRemovalAt && new Date(gig.scheduledRemovalAt) > new Date() && (
                    <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <AlarmClock className="w-3 h-3" />
                      Removal in 24h
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {gig.shortDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 text-xs bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200 rounded border border-sky-100">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {gig.category}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 rounded border border-indigo-100">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {gig.location}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 rounded border border-emerald-100">
                    <PhilippinePeso className="w-3 h-3 inline mr-1" />
                    ₱{gig.pay.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded border border-gray-100">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(gig.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-glow bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 text-white border-none shadow-md"
                  onClick={() => setSelectedGig(gig)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Review
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="btn-glow bg-gradient-to-r from-rose-500 to-red-600 text-white border-none shadow-md hover:shadow-lg"
                  onClick={() => handleDeleteClick(gig)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Review modal */}
      <Modal
        isOpen={!!selectedGig}
        onClose={() => setSelectedGig(null)}
        title="Job Post Review"
        size="xl"
      >
        {selectedGig && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Title</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  {selectedGig.title}
                </h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedGig.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selectedGig.status)}
                  <span className="capitalize">{selectedGig.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoPill icon={<Tag className="w-4 h-4" />} label="Category" value={selectedGig.category} />
              <InfoPill icon={<MapPin className="w-4 h-4" />} label="Location" value={selectedGig.location} />
              <InfoPill icon={<PhilippinePeso className="w-5 h-5" />} label="Pay" value={`₱${selectedGig.pay.toLocaleString()}`} />
              <InfoPill icon={<Clock className="w-4 h-4" />} label="Duration" value={selectedGig.duration || 'N/A'} />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Summary</p>
              <p className="text-gray-600 dark:text-gray-300">{selectedGig.shortDesc}</p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Full Description</p>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{selectedGig.fullDesc}</p>
            </div>

            {selectedGig.requirements?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Requirements</p>
                <div className="flex flex-wrap gap-2">
                  {selectedGig.requirements.map((req) => (
                    <span
                      key={req}
                      className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-100"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Job Post?"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Deleting will notify the client and remove the job from listings. You can either delete now or schedule a 24h hold so the client has time to review the warning.
              </p>
              {deleteTarget && (
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {deleteTarget.title}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-sky-400 transition-colors">
              <input
                type="radio"
                name="deleteMode"
                value="immediate"
                checked={deleteMode === 'immediate'}
                onChange={() => setDeleteMode('immediate')}
                className="text-sky-600 focus:ring-sky-500"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Delete now</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Immediate removal from the marketplace.</p>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-amber-400 transition-colors">
              <input
                type="radio"
                name="deleteMode"
                value="scheduled"
                checked={deleteMode === 'scheduled'}
                onChange={() => setDeleteMode('scheduled')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Schedule deletion (24h)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Grace period to warn the client; will auto-remove after 24h.</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="btn-glow bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 text-white border-none shadow-md"
              onClick={confirmDelete}
            >
              {deleteMode === 'scheduled' ? 'Schedule deletion' : 'Delete now'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

function InfoPill({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 flex items-start gap-3 shadow-sm">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-sky-100 dark:from-indigo-900/40 dark:to-sky-900/30 text-indigo-700 dark:text-indigo-200 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

