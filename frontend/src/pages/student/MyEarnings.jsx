import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { getTransactions, getGigs, getApplications } from '../../utils/localStorage'
import StatCard from '../../components/Shared/StatCard'
import Card from '../../components/UI/Card'
import { Coins, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function MyEarnings() {
  const { user } = useAuth()
  const [allTransactions, setAllTransactions] = useState([])
  const [allGigs, setAllGigs] = useState([])
  const [allApplications, setAllApplications] = useState([])

  // Load data from localStorage and update periodically
  useEffect(() => {
    const updateData = () => {
      setAllTransactions(getTransactions())
      setAllGigs(getGigs())
      setAllApplications(getApplications())
    }

    updateData()

    window.addEventListener('storage', updateData)
    const interval = setInterval(updateData, 2000)

    return () => {
      window.removeEventListener('storage', updateData)
      clearInterval(interval)
    }
  }, [])

  const myTransactions = allTransactions
    .filter(t => t.toUserId === user?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const totalEarnings = myTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingEarnings = myTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const completedCount = myTransactions.filter(t => t.status === 'completed').length

  // Dynamic Chart Data Generation
  const monthlyData = useMemo(() => {
    const months = []
    const today = new Date()

    // Generate last 6 months labels
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        earnings: 0,
        count: 0
      })
    }

    // Filter relevant completed gigs and sum earnings
    const completedUserGigs = allGigs.filter(gig => {
      if (gig.status !== 'completed') return false

      // Check if user is the student for this gig
      // Priority 1: Check direct studentId on gig (if architecture supports it)
      if (gig.studentId === user?.id) return true

      // Priority 2: Check applications to link user to gig
      // This ensures we capture gigs even if studentId isn't on the gig object
      const app = allApplications.find(a => a.gigId === gig.id && a.userId === user?.id)
      return app && app.status === 'completed'
    })

    // Map earnings to months
    completedUserGigs.forEach(gig => {
      // Determine completion date
      let date = new Date(gig.createdAt) // Fallback

      // Try to find more accurate date from application
      const app = allApplications.find(a => a.gigId === gig.id && a.userId === user?.id)
      if (app && app.updatedAt) {
        date = new Date(app.updatedAt)
      }

      const monthEntry = months.find(m =>
        m.monthIndex === date.getMonth() && m.year === date.getFullYear()
      )

      if (monthEntry) {
        monthEntry.earnings += (gig.pay || 0)
        monthEntry.count += 1
      }
    })

    return months.map(({ name, earnings, count }) => ({ month: name, earnings, count }))
  }, [allGigs, allApplications, user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Earnings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your earnings and payment history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={`₱${totalEarnings.toLocaleString()}`}
          icon={Coins}
          trend="up"
          trendValue="15%"
          color="emerald"
          showLink={false}
          delay={0}
        />
        <StatCard
          title="Pending Payments"
          value={`₱${pendingEarnings.toLocaleString()}`}
          icon={Clock}
          color="amber"
          showLink={false}
          delay={1}
        />
        <StatCard
          title="Completed Gigs"
          value={completedCount}
          icon={CheckCircle}
          color="blue"
          showLink={false}
          delay={2}
        />
        <StatCard
          title="Average per Gig"
          value={
            completedCount > 0
              ? `₱${Math.round(totalEarnings / completedCount).toLocaleString()}`
              : '₱0'
          }
          icon={TrendingUp}
          color="violet"
          showLink={false}
          delay={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Earnings Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Earnings (₱)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Gigs Completed
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Jobs Done" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Transaction History
        </h2>
        {myTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gig
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {myTransactions.map((trans) => {
                  const gig = allGigs.find(g => g.id === trans.gigId)
                  return (
                    <tr
                      key={trans.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {gig?.title || 'Unknown'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                          ₱{trans.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {trans.paymentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${trans.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                        >
                          {trans.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {new Date(trans.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
          </div>
        )}
      </Card>
    </div>
  )
}

