import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useLocalAuth'
import { mockApplications } from '../../data/mockApplications'
import { mockGigs } from '../../data/mockGigs'
import Card from '../../components/UI/Card'
import Select from '../../components/UI/Select'
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
  XCircle
} from 'lucide-react'

export default function MyApplications() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('')

  const myApplications = mockApplications
    .filter(app => app.userId === user?.id)
    .filter(app => !statusFilter || app.status === statusFilter)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))

  const stats = useMemo(() => {
    const all = mockApplications.filter(app => app.userId === user?.id)
    return {
      total: all.length,
      pending: all.filter(a => a.status === 'pending').length,
      hired: all.filter(a => a.status === 'hired').length,
      completed: all.filter(a => a.status === 'completed').length,
      rejected: all.filter(a => a.status === 'rejected').length
    }
  }, [user?.id])

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
              const gig = mockGigs.find(g => g.id === app.gigId)
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
    </div>
  )
}

function SummaryCard({ label, value, gradient, icon: Icon }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
      <div className="relative p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

