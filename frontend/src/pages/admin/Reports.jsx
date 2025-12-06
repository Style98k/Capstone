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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Reports() {
  const userData = [
    { name: 'Students', value: mockUsers.filter(u => u.role === 'student').length },
    { name: 'Clients', value: mockUsers.filter(u => u.role === 'client').length },
  ]

  const gigData = [
    { month: 'Jan', gigs: 5 },
    { month: 'Feb', gigs: 8 },
    { month: 'Mar', gigs: 12 },
    { month: 'Apr', gigs: 15 },
    { month: 'May', gigs: 18 },
    { month: 'Jun', gigs: mockGigs.length },
  ]

  const applicationData = [
    { status: 'Pending', count: mockApplications.filter(a => a.status === 'pending').length },
    { status: 'Hired', count: mockApplications.filter(a => a.status === 'hired').length },
    { status: 'Completed', count: mockApplications.filter(a => a.status === 'completed').length },
    { status: 'Rejected', count: mockApplications.filter(a => a.status === 'rejected').length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Platform statistics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            User Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Gigs Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gigData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gigs" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Application Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Summary Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total Users</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {mockUsers.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total Gigs</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {mockGigs.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total Applications</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {mockApplications.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total Transactions</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {mockTransactions.length}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

