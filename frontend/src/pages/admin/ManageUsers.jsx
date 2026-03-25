import { useState, useEffect } from 'react'
import { mockUsers } from '../../data/mockUsers'
import { triggerNotification } from '../../utils/notificationManager'
import Card from '../../components/UI/Card'
import { motion } from 'framer-motion'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
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

// Helper to get registered users from localStorage
const getRegisteredUsers = () => {
  try {
    const saved = localStorage.getItem('quickgig_registered_users_v2')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    return []
  }
}

// Helper to get per-user verification status
const getUserVerificationStatus = (userId) => {
  try {
    const statuses = JSON.parse(localStorage.getItem('quickgig_user_verification_statuses_v2') || '{}')
    const nbiStatus = localStorage.getItem(`nbiStatus_${userId}`) || 'unverified'
    return statuses[userId]
      ? { ...statuses[userId], nbiStatus }
      : { verificationStatus: 'unverified', assessmentStatus: 'unverified', nbiStatus }
  } catch (e) {
    return { verificationStatus: 'unverified', assessmentStatus: 'unverified', nbiStatus: 'unverified' }
  }
}

// Helper to save per-user verification status
const saveUserVerificationStatus = (userId, verificationStatus, assessmentStatus) => {
  try {
    const statuses = JSON.parse(localStorage.getItem('quickgig_user_verification_statuses_v2') || '{}')
    const nbiStatus = localStorage.getItem(`nbiStatus_${userId}`) || 'unverified'
    statuses[userId] = { verificationStatus, assessmentStatus, nbiStatus }
    localStorage.setItem('quickgig_user_verification_statuses_v2', JSON.stringify(statuses))
  } catch (e) {
    console.error('Error saving verification status:', e)
  }
}

export default function ManageUsers() {
  const [users, setUsers] = useState(() => {
    // Combine mockUsers with registered users from localStorage
    const registeredUsers = getRegisteredUsers()
    const allUsers = [...mockUsers, ...registeredUsers]

    // Get saved user updates (like profile photos) from quickgig_users_v2
    const savedUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')

    // Remove duplicates based on email
    const uniqueUsers = allUsers.filter((user, index, self) =>
      index === self.findIndex(u => u.email === user.email)
    )

    // Map users with their verification status and merge any saved updates
    return uniqueUsers.map(u => {
      const storedStatus = getUserVerificationStatus(u.id)

      // Find any saved updates for this user (like profile photo)
      const savedUpdates = savedUsers.find(su => su.id === u.id)

      // Special case for Maria (demo user with pending status)
      if (u.name === 'Maria Student') {
        return { ...u, ...savedUpdates, verificationStatus: 'pending', verified: false }
      }

      // For other users, use stored status or computed default
      const verificationStatus = storedStatus.verificationStatus || (u.verified ? 'verified' : 'unverified')
      const assessmentStatus = storedStatus.assessmentStatus || (u.verified ? 'verified' : 'unverified')

      return {
        ...u,
        ...savedUpdates, // Merge saved updates (profile photo, etc.)
        verificationStatus,
        assessmentStatus,
        verified: verificationStatus === 'verified' && assessmentStatus === 'verified'
      }
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
  const [storedNBI, setStoredNBI] = useState(null)
  const [storedClientID, setStoredClientID] = useState(null)

  // Refresh users list periodically to catch new registrations and profile updates
  useEffect(() => {
    const refreshUsers = () => {
      const registeredUsers = getRegisteredUsers()
      const allUsers = [...mockUsers, ...registeredUsers]

      // Get saved user updates (like profile photos) from quickgig_users_v2
      const savedUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')

      // Remove duplicates based on email
      const uniqueUsers = allUsers.filter((user, index, self) =>
        index === self.findIndex(u => u.email === user.email)
      )

      setUsers(prev => {
        // Keep existing user states but add new users
        const existingIds = new Set(prev.map(u => u.id))
        const newUsers = uniqueUsers.filter(u => !existingIds.has(u.id)).map(u => {
          const storedStatus = getUserVerificationStatus(u.id)
          const savedUpdates = savedUsers.find(su => su.id === u.id)
          return {
            ...u,
            ...savedUpdates,
            verificationStatus: storedStatus.verificationStatus || 'unverified',
            assessmentStatus: storedStatus.assessmentStatus || 'unverified',
            verified: false
          }
        })

        // Update existing users with latest verification statuses AND profile updates
        const updatedExisting = prev.map(u => {
          const storedStatus = getUserVerificationStatus(u.id)
          const savedUpdates = savedUsers.find(su => su.id === u.id)

          // Check if there are any updates to apply
          const hasVerificationChange = storedStatus.verificationStatus && storedStatus.verificationStatus !== u.verificationStatus
          const hasProfilePhotoChange = savedUpdates?.profilePhoto && savedUpdates.profilePhoto !== u.profilePhoto

          if (hasVerificationChange || hasProfilePhotoChange) {
            return {
              ...u,
              ...savedUpdates, // Merge profile updates
              verificationStatus: storedStatus.verificationStatus || u.verificationStatus,
              assessmentStatus: storedStatus.assessmentStatus || u.assessmentStatus,
              verified: storedStatus.verificationStatus === 'verified' && storedStatus.assessmentStatus === 'verified'
            }
          }
          return u
        })

        return [...updatedExisting, ...newUsers]
      })
    }

    // Refresh on mount and every 2 seconds
    refreshUsers()
    const interval = setInterval(refreshUsers, 2000)
    return () => clearInterval(interval)
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
      // Check for any pending status including NBI, ID status, or verified='pending'
      const nbiStatus = localStorage.getItem(`nbiStatus_${u.id}`) || 'unverified'
      const idStatus = localStorage.getItem(`idStatus_${u.id}`) || 'unverified'
      matchesTab = u.verificationStatus === 'pending' || u.assessmentStatus === 'pending' || nbiStatus === 'pending' || idStatus === 'pending' || u.verified === 'pending'
    } else if (verificationTab === 'verified') {
      matchesTab = u.verificationStatus === 'verified' && u.assessmentStatus === 'verified' && u.verified === 'verified'
    }

    return matchesSearch && matchesRole && matchesTab
  })

  const pendingCount = users.filter(u => {
    const nbiStatus = localStorage.getItem(`nbiStatus_${u.id}`) || 'unverified'
    const idStatus = localStorage.getItem(`idStatus_${u.id}`) || 'unverified'
    return u.verificationStatus === 'pending' || u.assessmentStatus === 'pending' || nbiStatus === 'pending' || idStatus === 'pending' || u.verified === 'pending'
  }).length

  const handleOpenVerify = (user) => {
    setUserToVerify(user)
    // Load images from per-user localStorage when opening the modal
    const idImage = localStorage.getItem(`studentIDImage_${user.id}`)
    const assessmentImage = localStorage.getItem(`studentAssessmentImage_${user.id}`)
    const nbiImage = localStorage.getItem(`nbiImage_${user.id}`)
    const clientIdImage = localStorage.getItem(`clientIDImage_${user.id}`)
    setStoredID(idImage)
    setStoredAssessment(assessmentImage)
    setStoredNBI(nbiImage)
    setStoredClientID(clientIdImage)
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
          nbiStatus: 'verified',
          idStatus: 'verified',
          verified: 'verified'
        }
        : u
    ))

    // Save per-user verification status
    saveUserVerificationStatus(userToVerify.id, 'verified', 'verified')

    // Also save NBI status and ID status
    localStorage.setItem(`nbiStatus_${userToVerify.id}`, 'verified')
    localStorage.setItem(`idStatus_${userToVerify.id}`, 'verified')

    // Update user's verified status in quickgig_users_v2 and registered users
    try {
      const users = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
      const userIndex = users.findIndex(u => u.id === userToVerify.id)
      if (userIndex !== -1) {
        users[userIndex].verified = 'verified'
        localStorage.setItem('quickgig_users_v2', JSON.stringify(users))
      }

      const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
      const regIndex = registeredUsers.findIndex(u => u.id === userToVerify.id)
      if (regIndex !== -1) {
        registeredUsers[regIndex].verified = 'verified'
        localStorage.setItem('quickgig_registered_users_v2', JSON.stringify(registeredUsers))
      }
    } catch (e) {
      console.error('Error updating user verified status:', e)
    }

    // Also save for backward compatibility with current student session
    localStorage.setItem('verificationStatus', 'verified')
    localStorage.setItem('assessmentStatus', 'verified')
    localStorage.setItem('studentNotification', 'Your documents have been approved! Your account is now fully verified.')

    // Trigger bell notification to user
    triggerNotification('student', 'Verification Approved', 'Your documents are approved. Your account is now verified!', 'system');
    triggerNotification('client', 'Verification Approved', 'Your documents are approved. Your account is now verified!', 'system');

    // Dispatch storage event for immediate UI updates
    window.dispatchEvent(new Event('storage'))

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
          nbiStatus: 'unverified',
          idStatus: 'unverified',
          verified: 'unverified'
        }
        : u
    ))

    // Save per-user verification status
    saveUserVerificationStatus(userToVerify.id, 'unverified', 'unverified')

    // Reset NBI status and ID status
    localStorage.setItem(`nbiStatus_${userToVerify.id}`, 'unverified')
    localStorage.setItem(`idStatus_${userToVerify.id}`, 'unverified')

    // Remove uploaded images so they have to re-upload
    localStorage.removeItem(`studentIDImage_${userToVerify.id}`)
    localStorage.removeItem(`studentAssessmentImage_${userToVerify.id}`)
    localStorage.removeItem(`nbiImage_${userToVerify.id}`)
    localStorage.removeItem(`clientIDImage_${userToVerify.id}`)

    // Update user's verified status in quickgig_users_v2 and registered users
    try {
      const users = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
      const userIndex = users.findIndex(u => u.id === userToVerify.id)
      if (userIndex !== -1) {
        users[userIndex].verified = 'unverified'
        localStorage.setItem('quickgig_users_v2', JSON.stringify(users))
      }

      const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
      const regIndex = registeredUsers.findIndex(u => u.id === userToVerify.id)
      if (regIndex !== -1) {
        registeredUsers[regIndex].verified = 'unverified'
        localStorage.setItem('quickgig_registered_users_v2', JSON.stringify(registeredUsers))
      }
    } catch (e) {
      console.error('Error updating user verified status:', e)
    }

    // Also save for backward compatibility with current student session
    localStorage.setItem('verificationStatus', 'unverified')
    localStorage.setItem('assessmentStatus', 'unverified')
    localStorage.setItem('studentNotification', 'Your documents were rejected. Please upload clearer copies.')

    // Trigger bell notification to user
    triggerNotification('student', 'Verification Rejected', 'Your documents were rejected. Please re-upload clearer copies.', 'system');
    triggerNotification('client', 'Verification Rejected', 'Your documents were rejected. Please re-upload clearer copies.', 'system');

    // Dispatch storage event for immediate UI updates
    window.dispatchEvent(new Event('storage'))

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
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
            {filteredUsers.length}
          </span>
        </div>
        <p className="text-gray-500 mt-1 text-sm">
          Manage users and permissions
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => { setVerificationTab('all'); setCurrentPage(1); }}
          className={`pb-2 px-1 text-sm font-medium whitespace-nowrap transition-all relative ${verificationTab === 'all'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500'
            }`}
        >
          All
        </button>
        <button
          onClick={() => { setVerificationTab('pending'); setCurrentPage(1); }}
          className={`pb-2 px-1 text-sm font-medium whitespace-nowrap transition-all relative ${verificationTab === 'pending'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500'
            }`}
        >
          Pending
          {pendingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => { setVerificationTab('verified'); setCurrentPage(1); }}
          className={`pb-2 px-1 text-sm font-medium whitespace-nowrap transition-all relative ${verificationTab === 'verified'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500'
            }`}
        >
          Verified
        </button>
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
          className="pl-10 pr-3 py-2 w-full text-sm bg-white border border-gray-200 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Table View */}
      <Card padding="p-0" delay={2}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                  <input
                    type="checkbox"
                    name="selectAll"
                    id="select-all-users"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
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
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 group"
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      name={`selectUser-${user.id}`}
                      id={`select-user-${user.id}`}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {user.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(user.name)}
                          flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
                      ${user.suspended ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.suspended ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {user.suspended ? 'Off' : 'On'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-0.5">
                      {user.verificationStatus === 'pending' && (
                        <button
                          onClick={() => handleOpenVerify(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Review"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
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
        <div className="flex items-center justify-center px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm text-gray-600">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Verification Modal */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Review User Documents"
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
                <label className="text-sm font-medium text-gray-500">
                  {userToVerify.role === 'student' ? 'Student ID No.' : 'User Role'}
                </label>
                <p className="text-lg font-bold text-gray-900">
                  {userToVerify.role === 'student'
                    ? (userToVerify.schoolId || '2024-001')
                    : 'Client'
                  }
                </p>
              </div>
            </div>

            {/* ID Photo Section - Different for Student vs Client */}
            {userToVerify.role === 'student' ? (
              <>
                {/* School ID for Students */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-500">School ID</label>
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

                {/* Assessment Form Section for Students */}
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
              </>
            ) : (
              <>
                {/* Valid ID for Clients */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-500">Valid ID</label>
                    {storedClientID && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        New Upload
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-8">
                    {storedClientID ? (
                      <img
                        src={storedClientID}
                        alt="Valid ID"
                        className="max-w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://placehold.co/600x400?text=Valid+ID"
                        }}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No Valid ID uploaded yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* NBI Clearance Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-500">NBI Clearance</label>
                {storedNBI && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                    New Upload
                  </span>
                )}
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-8">
                {storedNBI ? (
                  <img
                    src={storedNBI}
                    alt="NBI Clearance"
                    className="max-w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://placehold.co/600x200?text=NBI+Clearance"
                    }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No NBI Clearance uploaded yet</p>
                  </div>
                )}
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

