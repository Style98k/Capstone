import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { gigsAPI, applicationsAPI, transactionsAPI } from '../../utils/api'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { Edit, Pause, Play, Trash2, Eye, Briefcase, MapPin, Clock, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ManageGigs() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('')
  const [gigs, setGigs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  const fetchData = async () => {
    try {
      const [gigsData, appsData] = await Promise.all([
        gigsAPI.getByClient(user?.id),
        applicationsAPI.getAll()
      ])
      setGigs(gigsData || [])
      setApplications(appsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  const myGigs = gigs
    .filter(g => !statusFilter || g.status === statusFilter)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const getApplicationCount = (gigId) => {
    return applications.filter(app => app.gig_id === gigId).length
  }

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      try {
        await gigsAPI.delete(gigId)
        alert('Gig deleted successfully!')
        fetchData()
      } catch (error) {
        console.error('Failed to delete gig:', error)
        alert('Failed to delete gig. Please try again.')
      }
    }
  }

  const handleToggleGigStatus = async (gigId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'paused' : 'open'
    try {
      await gigsAPI.update(gigId, { status: newStatus })
      alert(`Gig ${newStatus === 'open' ? 'resumed' : 'paused'} successfully!`)
      fetchData()
    } catch (error) {
      console.error('Failed to update gig status:', error)
      alert('Failed to update gig status. Please try again.')
    }
  }

  const handleMarkComplete = async (gig) => {
    if (window.confirm('Mark this gig as completed? This will notify the student and allow you to make a payment.')) {
      try {
        // Update gig status
        await gigsAPI.update(gig.id, { status: 'completed' })

        // Find and update the hired application
        const hiredApp = applications.find(app => app.gig_id === gig.id && app.status === 'hired')
        if (hiredApp) {
          await applicationsAPI.updateStatus(hiredApp.id, 'completed')
          
          // Create pending transaction for payment
          await transactionsAPI.create({
            gigId: gig.id,
            fromUserId: user.id,
            toUserId: hiredApp.student_id,
            amount: gig.budget || gig.pay,
            status: 'pending',
            paymentMethod: null
          })
        }

        alert('Gig marked as completed! You can now process payment in the Payments page.')
        fetchData()
      } catch (error) {
        console.error('Failed to mark gig as completed:', error)
        alert('Failed to mark gig as completed. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Manage Gigs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Edit, pause, or close your job postings
              </p>
            </div>
            <Link to="/client/post-gig">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5 shadow-sm hover:shadow-md transition-all duration-200">
                Post New Job
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="paused">Paused</option>
              <option value="hired">Hired</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          {myGigs.length > 0 ? (
            myGigs.map((gig) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 relative"
              >
                <span
                  className={`absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-full ${gig.status === 'open'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : gig.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : gig.status === 'occupied' || gig.status === 'hired'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : gig.status === 'completed'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                  {gig.status}
                </span>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {gig.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {gig.description || gig.shortDesc}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{gig.category}</span>
                      <span>{gig.location}</span>
                      <span>₱{(gig.budget || gig.pay || 0).toLocaleString()}</span>
                      <span>{getApplicationCount(gig.id)} applications</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link to={`/gigs/${gig.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all duration-200 min-w-[80px] flex items-center justify-center">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to={`/client/applicants?gig=${gig.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all duration-200 min-w-[80px] flex items-center justify-center">
                          Applicants
                        </Button>
                      </motion.div>
                    </Link>
                    {gig.status === 'open' && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="secondary" size="sm" onClick={() => handleToggleGigStatus(gig.id, gig.status)} className="hover:bg-yellow-100 hover:text-yellow-700 hover:border-yellow-300 transition-all duration-200 min-w-[80px] flex items-center justify-center">
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      </motion.div>
                    )}
                    {gig.status === 'paused' && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="secondary" size="sm" onClick={() => handleToggleGigStatus(gig.id, gig.status)} className="hover:bg-green-100 hover:text-green-700 hover:border-green-300 transition-all duration-200 min-w-[80px] flex items-center justify-center">
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      </motion.div>
                    )}
                    {(gig.status === 'hired' || gig.status === 'occupied') && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button size="sm" onClick={() => handleMarkComplete(gig)} className="bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md transition-all duration-200 min-w-[120px] flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Complete
                        </Button>
                      </motion.div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="danger" size="sm" onClick={() => handleDeleteGig(gig.id)} className="hover:bg-red-700 hover:shadow-md transition-all duration-200 min-w-[80px] flex items-center justify-center">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
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
        </motion.div>
      </div>
    </div>
  )
}
