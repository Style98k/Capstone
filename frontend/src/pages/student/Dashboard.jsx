import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useLocalAuth'
import { mockGigs } from '../../data/mockGigs'
import { mockApplications } from '../../data/mockApplications'
import { mockNotifications } from '../../data/mockNotifications'
import { mockTransactions } from '../../data/mockTransactions'
import StatCard from '../../components/Shared/StatCard'
import GigCard from '../../components/Shared/GigCard'
import NotificationItem from '../../components/Shared/NotificationItem'
import {
  Coins,
  Briefcase,
  CheckCircle,
  Star,
  TrendingUp,
  Bell,
  CalendarDays,
  Clock3,
  ArrowUpRight,
  Search,
  MessageSquare,
  Sparkles
} from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const myApplications = mockApplications.filter(app => app.userId === user?.id)
  const pendingApps = myApplications.filter(app => app.status === 'pending').length
  const hiredApps = myApplications.filter(app => app.status === 'hired').length
  const completedApps = myApplications.filter(app => app.status === 'completed').length

  const myEarnings = mockTransactions
    .filter(t => t.toUserId === user?.id && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const recentGigs = mockGigs.filter(g => g.status === 'open').slice(0, 3)
  const myNotifications = mockNotifications.filter(n => n.userId === user?.id).slice(0, 5)

  const completionRate = useMemo(() => {
    if (!myApplications.length) return 0
    return Math.round((completedApps / myApplications.length) * 100)
  }, [myApplications.length, completedApps])

  return (
    <div className="space-y-8">
      {/* Hero / Header */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-indigo-600 to-emerald-500 text-white shadow-2xl p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur">
              <Sparkles className="w-4 h-4" />
              Student Workspace
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm">
              Hi {user?.name?.split(' ')[0]}, let’s wrap your gigs quickly
            </h1>
            <p className="text-white/85 max-w-2xl">
              Track applications, messages, and earnings in one clean view. Quick links below take you to the most common actions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/student/browse">
                <button className="inline-flex items-center gap-2 rounded-full bg-white text-sky-700 px-4 py-2 font-semibold shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl">
                  <Search className="w-4 h-4" />
                  Browse gigs
                </button>
              </Link>
              <Link to="/student/applications">
                <button className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-4 py-2 font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/25 hover:-translate-y-0.5">
                  <Briefcase className="w-4 h-4" />
                  Applications
                </button>
              </Link>
              <Link to="/student/messages">
                <button className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </button>
              </Link>
            </div>
          </div>
          {/* removed streak widget per request */}
        </div>
      </motion.section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Earnings"
          value={`₱${myEarnings.toLocaleString()}`}
          icon={Coins}
          trend="up"
          trendValue="12%"
          color="emerald"
          linkText="See payouts"
          delay={0}
          onClick={() => navigate('/student/earnings')}
        />
        <StatCard
          title="Active Applications"
          value={pendingApps}
          icon={Briefcase}
          color="blue"
          linkText="Manage applications"
          delay={1}
          onClick={() => navigate('/student/applications')}
        />
        <StatCard
          title="Completed Gigs"
          value={completedApps}
          icon={CheckCircle}
          color="amber"
          linkText="View history"
          delay={2}
          onClick={() => navigate('/student/applications')}
        />
        <StatCard
          title="Your Rating"
          value={user?.rating || '—'}
          icon={Star}
          color="violet"
          linkText="Improve profile"
          delay={3}
          onClick={() => navigate('/student/profile')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Recent Applications */}
          <div className="card border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Applications
                </h2>
              </div>
              <Link
                to="/student/applications"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {myApplications.slice(0, 4).map((app) => {
                const gig = mockGigs.find(g => g.id === app.gigId)
                const badgeClasses = app.status === 'hired'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200'
                  : app.status === 'pending'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'

                return (
                  <div
                    key={app.id}
                    className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-100 hover:shadow-lg dark:hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{gig?.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${badgeClasses}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-4 h-4" />
                        <span>{app.hours || '4-6h'} expected</span>
                      </div>
                      <span className="text-sky-600 dark:text-sky-400 font-medium inline-flex items-center gap-1">
                        Track status
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                )
              })}
              {myApplications.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No applications yet
                </p>
              )}
            </div>
          </div>

          {/* Recommended Gigs */}
          <div className="card border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recommended Gigs
                </h2>
              </div>
              <Link
                to="/student/browse"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
              >
                Browse all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentGigs.map((gig, idx) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-900/60"
                >
                  <div className="h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />
                  <GigCard gig={gig} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress Snapshot */}
          <div className="card border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress snapshot</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200">
                {completionRate}% done
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Balance your pipeline to keep a steady flow of gigs.
            </p>
            <div className="space-y-3">
              <ProgressBar label="Pending" value={pendingApps} max={Math.max(pendingApps, hiredApps, completedApps, 1)} color="from-amber-400 to-orange-500" />
              <ProgressBar label="Hired" value={hiredApps} max={Math.max(pendingApps, hiredApps, completedApps, 1)} color="from-sky-500 to-indigo-500" />
              <ProgressBar label="Completed" value={completedApps} max={Math.max(pendingApps, hiredApps, completedApps, 1)} color="from-emerald-500 to-teal-500" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total gigs</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{myApplications.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg rating</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.rating || '—'}</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Earnings</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₱{myEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h2>
              </div>
              <Link
                to="/notifications"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {myNotifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
              ))}
              {myNotifications.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No notifications
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ label, value, max, color }) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

