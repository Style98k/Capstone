import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useLocalAuth'
import { getApplications, getGigs } from '../../utils/localStorage'
import { saveRating, hasRated } from '../../utils/ratingUtils'
import Card from '../../components/UI/Card'
import Select from '../../components/UI/Select'
import Modal from '../../components/UI/Modal'
import {
  Calendar,
  MapPin,
  Coins,
  Clock,
  ArrowUpRight,
  Search,
  CheckCircle2,
  CheckCircle,
  Briefcase,
  Hourglass,
  XCircle,
  Star,
  Send,
  Loader
} from 'lucide-react'

export default function MyApplications() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('')
  const [allApplications, setAllApplications] = useState([])
  const [allGigs, setAllGigs] = useState([])

  // Rating modal state
  const [ratingModal, setRatingModal] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratedGigs, setRatedGigs] = useState({}) // Track which gigs have been rated

  // Load data from localStorage and update periodically
  useEffect(() => {
    const updateData = () => {
      setAllApplications(getApplications())
      setAllGigs(getGigs())
    }

    updateData()

    window.addEventListener('storage', updateData)
    const interval = setInterval(updateData, 2000)

    return () => {
      window.removeEventListener('storage', updateData)
      clearInterval(interval)
    }
  }, [])

  // Check which gigs have been rated by the student
  useEffect(() => {
    if (!user?.id) return
    const rated = {}
    allApplications
      .filter(app => app.userId === user.id && app.status === 'completed')
      .forEach(app => {
        const gig = allGigs.find(g => g.id === app.gigId)
        if (gig) {
          rated[app.gigId] = hasRated(user.id, gig.ownerId, app.gigId)
        }
      })
    setRatedGigs(rated)
  }, [allApplications, allGigs, user?.id])

  // Handle opening rating modal
  const handleOpenRatingModal = (gig, clientId, clientName) => {
    setRatingModal({
      gigId: gig.id,
      gigTitle: gig.title,
      clientId,
      clientName
    })
    setRating(5)
    setComment('')
    setHoveredStar(0)
  }

  // Handle submitting rating
  const handleSubmitRating = async () => {
    setSubmittingRating(true)

    await saveRating({
      raterId: user?.id,
      raterName: user?.name,
      raterRole: 'student',
      targetId: ratingModal.clientId,
      gigId: ratingModal.gigId,
      gigTitle: ratingModal.gigTitle,
      rating,
      comment
    })

    // Update rated gigs state
    setRatedGigs(prev => ({ ...prev, [ratingModal.gigId]: true }))

    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmittingRating(false)
    setRatingModal(null)
  }

  // Get client name from gig
  const getClientName = (gig) => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
      const client = registeredUsers.find(u => u.id === gig.ownerId)
      return client?.name || gig.ownerName || 'Client'
    } catch {
      return gig.ownerName || 'Client'
    }
  }

  const myApplications = allApplications
    .filter(app => app.userId === user?.id)
    .filter(app => !statusFilter || app.status === statusFilter)
    // Filter out applications for deleted gigs (orphaned data)
    .filter(app => allGigs.some(g => g.id === app.gigId))
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))

  const stats = useMemo(() => {
    // Only count applications where the gig still exists
    const all = allApplications
      .filter(app => app.userId === user?.id)
      .filter(app => allGigs.some(g => g.id === app.gigId))
    return {
      total: all.length,
      pending: all.filter(a => a.status === 'pending').length,
      hired: all.filter(a => a.status === 'hired').length,
      completed: all.filter(a => a.status === 'completed').length,
      rejected: all.filter(a => a.status === 'rejected').length
    }
  }, [allApplications, allGigs, user?.id])

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
      hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
    }
    return styles[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
  }

  const quickFilters = [
    { value: '', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending, icon: Hourglass },
    { value: 'hired', label: 'Hired', count: stats.hired, icon: Briefcase },
    { value: 'completed', label: 'Completed', count: stats.completed, icon: CheckCircle2 },
    { value: 'rejected', label: 'Rejected', count: stats.rejected, icon: XCircle },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Applications</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track status, payouts, and next steps at a glance.
            </p>
          </div>
          <Link
            to="/student/browse"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse gigs
          </Link>
        </div>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total applications" value={stats.total} gradient="from-sky-500 to-indigo-500" icon={Briefcase} />
        <SummaryCard label="Pending" value={stats.pending} gradient="from-amber-400 to-orange-500" icon={Hourglass} />
        <SummaryCard label="Hired" value={stats.hired} gradient="from-emerald-500 to-teal-500" icon={CheckCircle2} />
        <SummaryCard label="Completed" value={stats.completed} gradient="from-blue-500 to-cyan-500" icon={CheckCircle} />
      </div>

      {/* Filters */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" />
            Filter by status
          </div>
          <div className="w-full md:w-56">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'hired', label: 'Hired' },
                { value: 'completed', label: 'Completed' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((f) => {
            const ActiveIcon = f.icon
            const active = statusFilter === f.value
            return (
              <button
                key={f.value || 'all'}
                onClick={() => setStatusFilter(f.value)}
                className={`group inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${active
                  ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-200 hover:text-primary-700'
                  }`}
              >
                {ActiveIcon && <ActiveIcon className="w-4 h-4" />}
                {f.label}
                <span className="text-xs font-semibold opacity-70">({f.count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {myApplications.length > 0 ? (
            myApplications.map((app) => {
              const gig = allGigs.find(g => g.id === app.gigId)
              if (!gig) return null

              const statusColor = {
                pending: 'from-amber-400 to-orange-500',
                hired: 'from-emerald-500 to-teal-500',
                completed: 'from-blue-500 to-indigo-500',
                rejected: 'from-rose-500 to-pink-500',
              }[app.status] || 'from-slate-400 to-slate-600'

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden group">
                    <div className={`h-1 w-full bg-gradient-to-r ${statusColor}`} />
                    <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                              <Briefcase className="w-4 h-4" />
                              {gig.category || 'General'}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {gig.title}
                            </h3>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              app.status
                            )}`}
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {gig.shortDesc}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/70">
                            <MapPin className="w-4 h-4" />
                            <span>{gig.location}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/70">
                            <Clock className="w-4 h-4" />
                            <span>{gig.duration}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/70">
                            <Coins className="w-4 h-4" />
                            <span className="font-semibold text-gray-800 dark:text-gray-100">₱{(gig.pay || 0).toLocaleString()}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/70">
                            <Calendar className="w-4 h-4" />
                            <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {app.proposal && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-1">
                              Proposal
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                              {app.proposal}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Link
                          to={`/gigs/${gig.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-primary-200 hover:text-primary-700 transition-colors"
                        >
                          View gig
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        {app.status === 'hired' && (
                          <Link
                            to="/student/messages"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-semibold shadow-md shadow-primary-600/20 hover:bg-primary-700 transition-colors"
                          >
                            Message client
                          </Link>
                        )}
                        {app.status === 'completed' && !ratedGigs[gig.id] && (
                          <button
                            onClick={() => handleOpenRatingModal(gig, gig.ownerId, getClientName(gig))}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 text-white px-4 py-2 text-sm font-semibold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            Rate Client
                          </button>
                        )}
                        {app.status === 'completed' && ratedGigs[gig.id] && (
                          <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Rated
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <Card>
              <div className="max-w-md mx-auto text-center py-12 space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                  <Search className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">No applications yet</p>
                  <p className="text-gray-500 dark:text-gray-400">Apply to gigs and track them here.</p>
                </div>
                <Link
                  to="/student/browse"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 text-white px-5 py-2.5 text-sm font-semibold shadow-md shadow-primary-600/20 hover:bg-primary-700 transition-colors"
                >
                  Browse Gigs
                </Link>
              </div>
            </Card>
          )}
        </AnimatePresence>
      </div>

      {/* Rate Client Modal */}
      <Modal
        isOpen={!!ratingModal}
        onClose={() => setRatingModal(null)}
        title="Rate Your Client"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              How was your experience working with <span className="font-semibold text-gray-700 dark:text-gray-200">{ratingModal?.clientName}</span>?
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              For: {ratingModal?.gigTitle}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tap to rate</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Leave a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience working with this client..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setRatingModal(null)}
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRating}
              disabled={submittingRating}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingRating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function SummaryCard({ label, value, gradient, icon: Icon }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
      <div className="relative p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

