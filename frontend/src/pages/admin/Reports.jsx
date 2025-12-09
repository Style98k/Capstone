import { mockUsers } from '../../data/mockUsers'
import { mockGigs } from '../../data/mockGigs'
import { mockApplications } from '../../data/mockApplications'
import { mockTransactions } from '../../data/mockTransactions'
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
  Calendar
} from 'lucide-react'
import { useState } from 'react'

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

  const gigData = [
    { month: 'Jan', gigs: 5, sales: 3 },
    { month: 'Feb', gigs: 8, sales: 5 },
    { month: 'Mar', gigs: 12, sales: 8 },
    { month: 'Apr', gigs: 15, sales: 12 },
    { month: 'May', gigs: 18, sales: 10 },
    { month: 'Jun', gigs: mockGigs.length, sales: 14 },
    { month: 'Jul', gigs: 25, sales: 20 },
    { month: 'Aug', gigs: 28, sales: 24 },
  ]

  const applicationData = [
    { status: 'Pending', count: mockApplications.filter(a => a.status === 'pending').length },
    { status: 'Hired', count: mockApplications.filter(a => a.status === 'hired').length },
    { status: 'Completed', count: mockApplications.filter(a => a.status === 'completed').length },
    { status: 'Rejected', count: mockApplications.filter(a => a.status === 'rejected').length },
  ]

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

  return (
    <div className="space-y-8 animate-slide-up-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1 font-medium">Platform statistics and insights</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm hover:translate-y-[-2px]">
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
          value={mockUsers.length}
          icon={Users}
          color="blue"
          trend="up"
          trendValue="2.9%"
        />
        <StatCard
          title="Total Gigs"
          value={mockGigs.length}
          icon={ShoppingBag}
          color="violet"
          trend="up"
          trendValue="13%"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${mockTransactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`}
          icon={CreditCard}
          color="amber"
          trend="up"
          trendValue="14%"
        />
        <StatCard
          title="Total Applications"
          value={mockApplications.length}
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Apps</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pay</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockGigs.slice(0, 5).map((gig) => (
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
                    <span className="text-sm text-gray-600 font-medium">{gig.id.toUpperCase().replace('_', '#')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 font-medium">{gig.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 font-medium">
                      {Math.floor(Math.random() * 50) + 5}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                      ${gig.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                        gig.status === 'hired' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                      {gig.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">₱{gig.pay}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
