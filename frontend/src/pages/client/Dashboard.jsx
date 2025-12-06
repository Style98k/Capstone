import { useAuth } from '../../hooks/useLocalAuth'
import { mockGigs } from '../../data/mockGigs'
import { mockApplications } from '../../data/mockApplications'
import StatCard from '../../components/Shared/StatCard'
import Card from '../../components/UI/Card'
import { Briefcase, Users, CheckCircle, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ClientDashboard() {
  const { user } = useAuth()
  
  const myGigs = mockGigs.filter(g => g.ownerId === user?.id)
  const activeGigs = myGigs.filter(g => g.status === 'open').length
  const totalApplications = mockApplications.filter(app => 
    myGigs.some(g => g.id === app.gigId)
  ).length
  const hiredCount = mockApplications.filter(app => 
    myGigs.some(g => g.id === app.gigId) && app.status === 'hired'
  ).length
  const completedCount = mockApplications.filter(app => 
    myGigs.some(g => g.id === app.gigId) && app.status === 'completed'
  ).length

  const recentGigs = myGigs.slice(0, 3)
  const pendingApps = mockApplications
    .filter(app => myGigs.some(g => g.id === app.gigId) && app.status === 'pending')
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your job posts and applicants
          </p>
        </div>
        <Link to="/client/post-gig">
          <button className="btn btn-primary">Post New Job</button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Jobs"
          value={activeGigs}
          icon={Briefcase}
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={Users}
        />
        <StatCard
          title="Hired Students"
          value={hiredCount}
          icon={CheckCircle}
        />
        <StatCard
          title="Completed Gigs"
          value={completedCount}
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Job Posts
            </h2>
            <Link
              to="/client/manage-gigs"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentGigs.map((gig) => (
              <div
                key={gig.id}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {gig.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {gig.category} • ₱{gig.pay.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      gig.status === 'open'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {gig.status}
                  </span>
                </div>
              </div>
            ))}
            {recentGigs.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No jobs posted yet
              </p>
            )}
          </div>
        </Card>

        {/* Pending Applications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Applications
            </h2>
            <Link
              to="/client/applicants"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {pendingApps.map((app) => {
              const gig = mockGigs.find(g => g.id === app.gigId)
              return (
                <div
                  key={app.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {gig?.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Application received
                  </p>
                </div>
              )
            })}
            {pendingApps.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No pending applications
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

