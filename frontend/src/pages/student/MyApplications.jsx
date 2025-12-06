import { useState } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { mockApplications } from '../../data/mockApplications'
import { mockGigs } from '../../data/mockGigs'
import Card from '../../components/UI/Card'
import Select from '../../components/UI/Select'
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MyApplications() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('')
  
  const myApplications = mockApplications
    .filter(app => app.userId === user?.id)
    .filter(app => !statusFilter || app.status === statusFilter)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      hired: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    }
    return styles[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track the status of your job applications
          </p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4">
          <Select
            label="Filter by Status"
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

      <div className="space-y-4">
        {myApplications.length > 0 ? (
          myApplications.map((app) => {
            const gig = mockGigs.find(g => g.id === app.gigId)
            if (!gig) return null

            return (
              <Card key={app.id} hover>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {gig.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {gig.shortDesc}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{gig.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{gig.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">₱{gig.pay.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {app.proposal && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Your Proposal:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {app.proposal}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/gigs/${gig.id}`}
                      className="btn btn-outline text-center"
                    >
                      View Gig
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No applications found
              </p>
              <Link to="/student/browse" className="btn btn-primary">
                Browse Gigs
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

