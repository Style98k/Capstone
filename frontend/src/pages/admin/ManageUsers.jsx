import { useState, useEffect } from 'react'
import { mockUsers } from '../../data/mockUsers'
import Card from '../../components/UI/Card'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
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
  const [users, setUsers] = useState(() => {
    // Initial state setup with hardcoded pending status for Maria
    return mockUsers.map(u => {
      if (u.name === 'Maria Student') {
        return { ...u, verificationStatus: 'pending', verified: false }
      }
      return { ...u, verificationStatus: u.verified ? 'verified' : 'unverified' }
    })
  })

  const [filter, setFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [verificationTab, setVerificationTab] = useState('all') // 'all', 'pending', 'verified'
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('table')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedUsers, setSelectedUsers] = useState([])

  // Verification Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [userToVerify, setUserToVerify] = useState(null)
  const [storedID, setStoredID] = useState(null)
  const [storedAssessment, setStoredAssessment] = useState(null)

  // Load Logic
  useEffect(() => {
    const storedStatus = localStorage.getItem('verificationStatus')
    if (storedStatus) {
      setUsers(prev => prev.map(u =>
        u.name === 'Maria Student'
          ? { ...u, verificationStatus: storedStatus, verified: storedStatus === 'verified' }
          : u
      ))
    }
  }, [])

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      (u.role && u.role.toLowerCase().includes(filter.toLowerCase()))

    const matchesRole = roleFilter === 'all' || u.role === roleFilter

    // Updated Verification Tab Filter
    let matchesTab = true
    if (verificationTab === 'pending') {
      matchesTab = u.verificationStatus === 'pending' || u.assessmentStatus === 'pending'
    } else if (verificationTab === 'verified') {
      matchesTab = u.verificationStatus === 'verified' && u.assessmentStatus === 'verified'
    }

    return matchesSearch && matchesRole && matchesTab
  })

  const pendingCount = users.filter(u => 
    u.verificationStatus === 'pending' || u.assessmentStatus === 'pending'
  ).length

  const handleOpenVerify = (user) => {
    setUserToVerify(user)
    // Load images from localStorage when opening the modal
    const idImage = localStorage.getItem('studentIDImage')
    const assessmentImage = localStorage.getItem('studentAssessmentImage')
    setStoredID(idImage)
    setStoredAssessment(assessmentImage)
    setIsVerifyModalOpen(true)
  }

  const handleApproveVerify = () => {
    if (!userToVerify) return

    setUsers(prev => prev.map(u =>
      u.id === userToVerify.id
        ? { 
            ...u, 
            verificationStatus: 'verified',
            assessmentStatus: 'verified',
            verified: true 
          }
        : u
    ))

    localStorage.setItem('verificationStatus', 'verified')
    localStorage.setItem('assessmentStatus', 'verified')
    localStorage.setItem('studentNotification', 'Your School ID and Assessment Form have been approved! You are now fully verified.')
    setIsVerifyModalOpen(false)
    setUserToVerify(null)
  }

  const handleRejectVerify = () => {
    if (!userToVerify) return

    setUsers(prev => prev.map(u =>
      u.id === userToVerify.id
        ? { 
            ...u, 
            verificationStatus: 'unverified',
            assessmentStatus: 'unverified',
            verified: false 
          }
        : u
    ))

    localStorage.setItem('verificationStatus', 'unverified')
    localStorage.setItem('assessmentStatus', 'unverified')
    localStorage.setItem('studentNotification', 'Your documents were rejected. Please upload clearer copies.')
    setIsVerifyModalOpen(false)
    setUserToVerify(null)
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleVerify = (userId) => {
    setUsers(users.map(u => (u.id === userId ? { ...u, verified: true } : u)))
  }

  const handleSuspend = (userId) => {
    setUsers(users.map(u => (u.id === userId ? { ...u, suspended: !u.suspended } : u)))
  }

  const handleDelete = (userId) => {
    setUsers(users.filter(u => u.id !== userId))
  }

  // Get unique roles for filter
  const roles = [...new Set(users.map(u => u.role).filter(Boolean))]

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
            <h1 className="text-3xl font-bold text-gray-900">User management</h1>
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
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => { setVerificationTab('all'); setCurrentPage(1); }}
          className={`pb-3 px-1 text-sm font-medium transition-all relative ${verificationTab === 'all'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          All Users
        </button>
        <button
          onClick={() => { setVerificationTab('pending'); setCurrentPage(1); }}
          className={`pb-3 px-1 text-sm font-medium transition-all relative ${verificationTab === 'pending'
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
          onClick={() => { setVerificationTab('verified'); setCurrentPage(1); }}
          className={`pb-3 px-1 text-sm font-medium transition-all relative ${verificationTab === 'verified'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Verified
        </button>
      </div>

      {/* Toolbar */}
      <Card padding="p-4" delay={1}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left side - View toggles & Filters */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggles */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Table2 className="w-4 h-4" />
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                Board
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200" />

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 
                  rounded-lg hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right side - Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                id="search-users"
                placeholder="Search users..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Views Container */}
      <AnimatePresence mode="wait">
        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="p-0" delay={2}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          name="selectAll"
                          id="select-all-users"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Full name
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Joined date
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Verified
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent 
                          transition-colors duration-200 group"
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            name={`selectUser-${user.id}`}
                            id={`select-user-${user.id}`}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(user.name)} 
                              flex items-center justify-center text-white font-semibold text-sm shadow-lg
                              group-hover:scale-110 transition-transform duration-200`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                            {user.email}
                          </a>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-600">{user.role || 'N/A'}</span>
                        </td>
                        <td className="py-4 px-6">
                          {user.suspended ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium 
                              bg-red-50 text-red-700 rounded-full border border-red-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium 
                              bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-gray-500 text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                            : 'N/A'
                          }
                        </td>
                        <td className="py-4 px-6">
                          {user.verificationStatus === 'pending' ? (
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Pending Review
                            </span>
                          ) : user.verified ? (
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              Verified
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVerify(user.id)}
                              className="text-gray-400 font-medium flex items-center gap-1 hover:text-gray-600 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Unverified
                            </button>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            {user.verificationStatus === 'pending' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleOpenVerify(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Review Verification"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSuspend(user.id)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title={user.suspended ? "Unsuspend user" : "Suspend user"}
                            >
                              <Shield className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Table */}
              <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100">

                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                            ${currentPage === pageNum
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {pageNum}
                        </motion.button>
                      )
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-400 px-1">...</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                        >
                          {totalPages}
                        </motion.button>
                      </>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* BOARD/GRID VIEW */}
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl 
                    transition-all duration-300 relative overflow-hidden"
                >
                  {/* Gradient accent on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    {user.suspended ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(user.name)} 
                      flex items-center justify-center text-white font-bold text-xl shadow-lg
                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate max-w-full">{user.email}</p>
                  </div>

                  {/* Info badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {user.role || 'N/A'}
                    </span>
                    {user.verified ? (
                      <span className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-2 pt-3 border-t border-gray-100">
                    {!user.verified && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerify(user.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Verify user"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit user"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuspend(user.id)}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title={user.suspended ? "Unsuspend user" : "Suspend user"}
                    >
                      <Shield className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination for Grid */}
            <Card padding="p-4" className="mt-6">
              <div className="flex items-center justify-end">

                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                            ${currentPage === pageNum
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {pageNum}
                        </motion.button>
                      )
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-400 px-1">...</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                        >
                          {totalPages}
                        </motion.button>
                      </>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="p-0" delay={2}>
              <div className="divide-y divide-gray-50">
                {paginatedUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-transparent 
                      transition-all duration-200 group"
                  >
                    {/* Left side - User info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(user.name)} 
                        flex items-center justify-center text-white font-bold text-lg shadow-md
                        group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {user.name}
                          </h3>
                          {user.suspended ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium 
                              bg-red-50 text-red-700 rounded-full">
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium 
                              bg-emerald-50 text-emerald-700 rounded-full">
                              Active
                            </span>
                          )}
                          {user.verified ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{user.email}</span>
                          <span>•</span>
                          <span>{user.role || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {!user.verified && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVerify(user.id)}
                          className="px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 
                            hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Verify
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuspend(user.id)}
                        className="px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 
                          hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        {user.suspended ? 'Unsuspend' : 'Suspend'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 
                          hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination for List */}
              <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100">

                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                            ${currentPage === pageNum
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {pageNum}
                        </motion.button>
                      )
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-400 px-1">...</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                        >
                          {totalPages}
                        </motion.button>
                      </>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors
                      disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
                <label className="text-sm font-medium text-gray-500">Student ID No.</label>
                <p className="text-lg font-bold text-gray-900">
                  {userToVerify.schoolId || '2024-001'}
                </p>
              </div>
            </div>

            {/* ID Photo Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-500">ID Photo</label>
                {userToVerify.verificationStatus === 'pending' && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                    New Upload
                  </span>
                )}
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={storedID || "https://placehold.co/600x400"}
                  alt="Student ID"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://placehold.co/600x400"
                  }}
                />
              </div>
            </div>

            {/* Assessment Form Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-500">Assessment Form / COR</label>
                {userToVerify.assessmentStatus === 'pending' && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                    New Upload
                  </span>
                )}
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-8">
                <img
                  src={storedAssessment || "https://placehold.co/600x200?text=Assessment+Form+PDF"}
                  alt="Assessment Form"
                  className="max-w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://placehold.co/600x200?text=Assessment+Form+PDF"
                  }}
                />
              </div>
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

