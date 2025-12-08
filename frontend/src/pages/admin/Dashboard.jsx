import { mockUsers } from '../../data/mockUsers'
import { mockGigs } from '../../data/mockGigs'
import { mockApplications } from '../../data/mockApplications'
import { mockTransactions } from '../../data/mockTransactions'
import StatCard from '../../components/Shared/StatCard'
import Card from '../../components/UI/Card'
import { Users, Briefcase, FileText, Coins } from 'lucide-react'

export default function AdminDashboard() {
  const totalUsers = mockUsers.length
  const students = mockUsers.filter(u => u.role === 'student').length
  const clients = mockUsers.filter(u => u.role === 'client').length
  const activeGigs = mockGigs.filter(g => g.status === 'open').length
  const totalApplications = mockApplications.length
  const totalTransactions = mockTransactions.length
  const totalEarnings = 0 // Platform total earnings

  const pendingVerifications = mockUsers.filter(u => !u.verified && u.role !== 'admin').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of platform activity and statistics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          trend="up"
          trendValue="5%"
        />
        <StatCard
          title="Active Gigs"
          value={activeGigs}
          icon={Briefcase}
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={FileText}
        />
        <StatCard
          title="Total Earnings"
          value={`₱${totalEarnings.toLocaleString()}`}
          icon={Coins}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            User Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Students</span>
              <span className="font-semibold text-gray-900 dark:text-white">{students}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Clients</span>
              <span className="font-semibold text-gray-900 dark:text-white">{clients}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Pending Verifications</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {pendingVerifications}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {mockGigs.slice(0, 5).map((gig) => (
              <div
                key={gig.id}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="font-medium text-gray-900 dark:text-white">{gig.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posted {new Date(gig.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

