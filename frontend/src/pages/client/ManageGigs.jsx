import { useState, useMemo } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { getGigs, getApplications, getGigsByOwner, initializeLocalStorage } from '../../utils/localStorage'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { Edit, Pause, Play, Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManageGigs() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('')
  
  // Get data from localStorage
  const gigs = useMemo(() => {
    initializeLocalStorage()
    return getGigs()
  }, [])
  
  const applications = useMemo(() => {
    return getApplications()
  }, [])
  
  const myGigs = gigs
    .filter(g => g.ownerId === user?.id)
    .filter(g => !statusFilter || g.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const getApplicationCount = (gigId) => {
    return applications.filter(app => app.gigId === gigId).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Gigs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit, pause, or close your job postings
          </p>
        </div>
        <Link to="/client/post-gig">
          <Button>Post New Job</Button>
        </Link>
      </div>

      <div className="card">
        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {myGigs.length > 0 ? (
          myGigs.map((gig) => (
            <Card key={gig.id} hover>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {gig.title}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded ${
                        gig.status === 'open'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : gig.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {gig.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {gig.shortDesc}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{gig.category}</span>
                    <span>{gig.location}</span>
                    <span>₱{gig.pay.toLocaleString()}</span>
                    <span>{getApplicationCount(gig.id)} applications</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/gigs/${gig.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/client/applicants?gig=${gig.id}`}>
                    <Button variant="outline" size="sm">
                      Applicants
                    </Button>
                  </Link>
                  {gig.status === 'open' ? (
                    <Button variant="secondary" size="sm">
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No gigs found</p>
              <Link to="/client/post-gig">
                <Button>Post Your First Job</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

