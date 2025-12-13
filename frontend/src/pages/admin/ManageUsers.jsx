import { useState, useEffect } from 'react'
import { authAPI } from '../../utils/api'
import Card from '../../components/UI/Card'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  List,
  Table2,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Shield,
  Eye
} from 'lucide-react'
import Modal from '../../components/UI/Modal'
import Button from '../../components/UI/Button'

// Avatar color palette
const avatarColors = [
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500',
  'from-blue-400 to-indigo-500',
  'from-cyan-400 to-teal-500',
  'from-emerald-400 to-green-500',
  'from-amber-400 to-orange-500',
  'from-red-400 to-rose-500',
  'from-fuchsia-400 to-pink-500',
]

const getAvatarColor = (name) => {
  const index = name.charCodeAt(0) % avatarColors.length
  return avatarColors[index]
}

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [verificationTab, setVerificationTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('table')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedUsers, setSelectedUsers] = useState([])

  // Verification Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [userToVerify, setUserToVerify] = useState(null)

  // Fetch users from backend API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const data = await authAPI.getAllUsers()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUsers, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      (u.role && u.role.toLowerCase().includes(filter.toLowerCase()))

    const matchesRole = roleFilter === 'all' || u.role === roleFilter

    // Verification Tab Filter
    let matchesTab = true
    if (verificationTab === 'pending') {
      matchesTab = u.verificationStatus === 'pending'
    } else if (verificationTab === 'verified') {
      matchesTab = u.verificationStatus === 'verified'
    }

    return matchesSearch && matchesRole && matchesTab
  })

  const pendingCount = users.filter(u => u.verificationStatus === 'pending').length

  const handleOpenVerify = (user) => {
    setUserToVerify(user)
    setIsVerifyModalOpen(true)
  }

  const handleApproveVerify = async () => {
    if (!userToVerify) return

    try {
      await authAPI.updateUser(userToVerify.id, {
        verificationStatus: 'verified'
      })

      setUsers(prev => prev.map(u =>
        u.id === userToVerify.id
          ? { ...u, verificationStatus: 'verified' }
          : u
      ))

      setIsVerifyModalOpen(false)
      setUserToVerify(null)
    } catch (error) {
      console.error('Error approving verification:', error)
    }
  }

  const handleRejectVerify = async () => {
    if (!userToVerify) return

    try {
      await authAPI.updateUser(userToVerify.id, {
        verificationStatus: 'rejected'
      })

      setUsers(prev => prev.map(u =>
        u.id === userToVerify.id
          ? { ...u, verificationStatus: 'rejected' }
          : u
      ))

      setIsVerifyModalOpen(false)
      setUserToVerify(null)
    } catch (error) {
      console.error('Error rejecting verification:', error)
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleVerify = async (userId) => {
    try {
      await authAPI.updateUser(userId, { verificationStatus: 'verified' })
      setUsers(users.map(u => (u.id === userId ? { ...u, verificationStatus: 'verified' } : u)))
    } catch (error) {
      console.error('Error verifying user:', error)
    }
  }

  const handleSuspend = async (userId) => {
    try {
      const user = users.find(u => u.id === userId)
      await authAPI.updateUser(userId, { suspended: !user?.suspended })
      setUsers(users.map(u => (u.id === userId ? { ...u, suspended: !u.suspended } : u)))
    } catch (error) {
      console.error('Error suspending user:', error)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await authAPI.deleteUser(userId)
        setUsers(users.filter(u => u.id !== userId))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  // Get unique roles for filter
  const roles = [...new Set(users.map(u => u.role).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <span className="px-3 py-1 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
              {filteredUsers.length}
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Manage your team members and their account permissions here.
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => { setVerificationTab('all'); setCurrentPage(1) }}
          className={`pb-3 px-1 text-sm font-medium transition-all relative ${
            verificationTab === 'all'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => { setVerificationTab('pending'); setCurrentPage(1) }}
          className={`pb-3 px-1 text-sm font-medium transition-all relative ${
            verificationTab === 'pending'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Verification
          {pendingCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => { setVerificationTab('verified'); setCurrentPage(1) }}
          className={`pb-3 px-1 text-sm font-medium transition-all relative ${
            verificationTab === 'verified'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Verified
        </button>
      </div>

      {/* Toolbar */}
      <Card padding="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* View Mode Toggles */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                  ${viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Table2 className="w-4 h-4" />
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                  ${viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                  ${viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 
                rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </Card>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card padding="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Verification</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(user.name)} 
                            flex items-center justify-center text-white font-semibold text-sm`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <a href={`mailto:${user.email}`} className="text-indigo-600 hover:underline">
                          {user.email}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{user.role || 'N/A'}</td>
                      <td className="py-4 px-6">
                        {user.suspended ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium 
                            bg-red-50 text-red-700 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium 
                            bg-emerald-50 text-emerald-700 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {user.verificationStatus === 'pending' ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending
                          </span>
                        ) : user.verificationStatus === 'verified' ? (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {user.verificationStatus === 'pending' && (
                            <button
                              onClick={() => handleOpenVerify(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Review Verification"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleSuspend(user.id)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title={user.suspended ? "Unsuspend user" : "Suspend user"}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = Math.max(1, Math.min(totalPages, i + Math.max(1, currentPage - 2)))
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                        ${currentPage === pageNum
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl 
                  transition-all duration-300 group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(user.name)} 
                    flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="mt-3 font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>

                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {user.role || 'N/A'}
                    </span>
                    {user.verificationStatus === 'verified' && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex justify-center gap-2 mt-4 w-full">
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="flex-1 p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-xs font-medium"
                    >
                      {user.suspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="flex-1 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card padding="p-0">
            <div className="divide-y divide-gray-50">
              {paginatedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(user.name)} 
                      flex items-center justify-center text-white font-bold`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 
                        hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      {user.suspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 
                        hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Verification Modal */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify Student Documents"
        size="lg"
      >
        {userToVerify && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg font-bold text-gray-900">{userToVerify.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg font-bold text-gray-900">{userToVerify.email}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-2">Verification Status</label>
              <p className="text-lg font-bold text-amber-700 bg-amber-50 p-3 rounded-lg">
                Pending Review
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="danger"
                onClick={handleRejectVerify}
                className="bg-red-50 text-red-600 hover:bg-red-100 border-none"
              >
                Reject
              </Button>
              <Button
                onClick={handleApproveVerify}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}

