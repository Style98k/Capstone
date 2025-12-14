import { useState, useEffect } from 'react'
import { mockUsers } from '../../data/mockUsers'
import { mockTransactions } from '../../data/mockTransactions'
import { getGigs, getApplications } from '../../utils/localStorage'
import Card from '../../components/UI/Card'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Users,
  ShoppingBag,
  FileText,
  CreditCard,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Coins
} from 'lucide-react'

// Helper to get all users (mock + registered from both storage keys)
const getAllUsers = () => {
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
    const additionalUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
    const allUsers = [...mockUsers]
    const seenEmails = new Set(mockUsers.map(u => u.email))

    for (const user of [...registeredUsers, ...additionalUsers]) {
      if (!seenEmails.has(user.email)) {
        allUsers.push(user)
        seenEmails.add(user.email)
      }
    }
    return allUsers
  } catch (error) {
    return mockUsers
  }
}

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  }

  const trendColor = trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight

  return (
    <Card className="h-full" hover={true}>
      <div className="flex flex-col h-full justify-between">
        <div className={`p-2 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
          <p className="text-gray-500 font-medium text-sm">{title}</p>
        </div>
        <div className="flex items-center mt-4">
          <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendColor}`}>
            <TrendIcon size={14} className="mr-1" />
            {trendValue}
          </span>
          <span className="text-gray-400 text-xs ml-2">vs last month</span>
        </div>
      </div>
    </Card>
  )
}

export default function Reports() {
  const [dateRange] = useState('2/11/20 - 2/11/20')
  const [allUsers, setAllUsers] = useState(getAllUsers())
  const [allGigs, setAllGigs] = useState([])
  const [allApplications, setAllApplications] = useState([])

  // Load data from localStorage and update periodically
  useEffect(() => {
    const updateData = () => {
      setAllUsers(getAllUsers())
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

  // Calculate real stats
  const platformRevenue = allGigs
    .filter(g => g.status === 'completed' && g.platformFee)
    .reduce((acc, gig) => acc + (gig.platformFee || 0), 0)

  const transactionVolume = allGigs
    .filter(g => g.status === 'completed' && g.paidAmount)
    .reduce((acc, gig) => acc + (gig.paidAmount || 0), 0)

  // Process Application Data
  const applicationData = [
    { status: 'Pending', count: allApplications.filter(a => a.status === 'pending').length },
    { status: 'Hired', count: allApplications.filter(a => a.status === 'hired').length },
    { status: 'Completed', count: allApplications.filter(a => a.status === 'completed').length },
    { status: 'Rejected', count: allApplications.filter(a => a.status === 'rejected').length },
  ]

  // Process Gig Data (Last 6 Months)
  const getLast6Months = () => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        monthIndex: d.getMonth(), // 0-11
        year: d.getFullYear()
      })
    }
    return months
  }

  const gigData = getLast6Months().map(monthInfo => {
    // Filter gigs for this month and year
    const monthlyGigs = allGigs.filter(g => {
      const d = new Date(g.createdAt)
      return d.getMonth() === monthInfo.monthIndex && d.getFullYear() === monthInfo.year
    })

    const monthlySales = monthlyGigs
      .filter(g => g.status === 'completed' && g.paidAmount)
      .reduce((sum, g) => sum + (g.paidAmount || 0), 0)

    return {
      month: monthInfo.name,
      gigs: monthlyGigs.length,
      sales: monthlySales
    }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center text-sm">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 capitalize mr-2">{entry.name}:</span>
              <span className="font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const handleExport = () => {
    // Filter completed gigs
    const completedGigs = allGigs.filter(g => g.status === 'completed')

    if (completedGigs.length === 0) {
      alert('No completed transactions to export.')
      return
    }

    // Prepare CSV content
    const headers = ['Date,Job ID,Title,Client,Student,Amount,Platform Fee']

    const rows = completedGigs.map(gig => {
      const client = allUsers.find(u => u.id === gig.ownerId)?.name || 'Unknown Client'

      // Find the hired/completed student for this gig
      const application = allApplications.find(app => app.gigId === gig.id && app.status === 'completed')
      const student = allUsers.find(u => u.id === application?.userId)?.name || 'Unknown Student'

      const date = new Date(gig.createdAt).toLocaleDateString()
      const amount = gig.paidAmount || 0
      const fee = gig.platformFee || 0

      // Helper to escape CSV fields
      const escape = (text) => `"${String(text).replace(/"/g, '""')}"`

      return [
        escape(date),
        escape(gig.id),
        escape(gig.title),
        escape(client),
        escape(student),
        amount,
        fee
      ].join(',')
    })

    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'QuickGig_Financial_Report.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-slide-up-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1 font-medium">Platform statistics and insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm hover:translate-y-[-2px]"
          >
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm hover:translate-y-[-2px]">
            <Calendar size={16} />
            {dateRange}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={allUsers.length}
          icon={Users}
          color="blue"
          trend="up"
          trendValue="2.9%"
        />
        <StatCard
          title="Total Gigs"
          value={allGigs.length}
          icon={ShoppingBag}
          color="violet"
          trend="up"
          trendValue="13%"
        />

        <StatCard
          title="Total Transaction Volume"
          value={`₱${transactionVolume.toLocaleString()}`}
          icon={CreditCard}
          color="amber"
          trend="up"
          trendValue="14%"
        />
        <StatCard
          title="Total Applications"
          value={allApplications.length}
          icon={FileText}
          color="emerald"
          trend="up"
          trendValue="16%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Application Status</h2>
              <div className="text-gray-400 text-sm mt-1">Application overview</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-semibold text-gray-500">Overview</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Gigs Overview</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-emerald-500 font-bold text-lg">+20%</span>
                <span className="text-gray-400 text-sm">vs last month</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreHorizontal size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gigData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="gigs"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Selling Product / Recent Gigs Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Gigs & Activity</h2>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreHorizontal size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Gig Title
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applicants</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gig Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allGigs.slice(0, 5).map((gig) => {
                const applicantCount = allApplications.filter(app => app.gigId === gig.id).length
                return (
                  <tr key={gig.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <ShoppingBag size={20} className="text-gray-400" />
                        </div>
                        <span className="font-semibold text-gray-900">{gig.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-mono">#{gig.id.substring(gig.id.length - 6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium">{gig.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-semibold">{applicantCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                      ${gig.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                          gig.status === 'hired' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                        {gig.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">₱{(gig.pay || 0).toLocaleString()}</span>
                    </td>
                  </tr>
                )
              })}
              {allGigs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No gigs posted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
