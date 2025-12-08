import { useAuth } from '../../hooks/useLocalAuth'
import { mockGigs } from '../../data/mockGigs'
import { mockApplications } from '../../data/mockApplications'
import { mockNotifications } from '../../data/mockNotifications'
import { mockTransactions } from '../../data/mockTransactions'
import StatCard from '../../components/Shared/StatCard'
import GigCard from '../../components/Shared/GigCard'
import NotificationItem from '../../components/Shared/NotificationItem'
import { Coins, Briefcase, CheckCircle, Star, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { user } = useAuth()
  
  const myApplications = mockApplications.filter(app => app.userId === user?.id)
  const pendingApps = myApplications.filter(app => app.status === 'pending').length
  const hiredApps = myApplications.filter(app => app.status === 'hired').length
  const completedApps = myApplications.filter(app => app.status === 'completed').length
  
  const myEarnings = mockTransactions
    .filter(t => t.toUserId === user?.id && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const recentGigs = mockGigs.filter(g => g.status === 'open').slice(0, 3)
  const myNotifications = mockNotifications.filter(n => n.userId === user?.id).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your gigs today
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={`₱${myEarnings.toLocaleString()}`}
          icon={Coins}
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Active Applications"
          value={pendingApps}
          icon={Briefcase}
        />
        <StatCard
          title="Completed Gigs"
          value={completedApps}
          icon={CheckCircle}
        />
        <StatCard
          title="Your Rating"
          value={user?.rating || '—'}
          icon={Star}
        />
      </div>

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Applications
            </h2>
            <Link
              to="/student/applications"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {myApplications.slice(0, 3).map((app) => {
              const gig = mockGigs.find(g => g.id === app.gigId)
              return (
                <div
                  key={app.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {gig?.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Status: <span className="capitalize">{app.status}</span>
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        app.status === 'hired'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : app.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {app.status}
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

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            <Link
              to="/notifications"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
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

      {/* Recommended Gigs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recommended Gigs
          </h2>
          <Link
            to="/student/browse"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentGigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      </div>
    </div>
  )
}

