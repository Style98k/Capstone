import { useState, useEffect, useMemo } from 'react'
import { Eye, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import ApplicantDetailsModal from '../../components/applicants/ApplicantDetailsModal'
import { useAuth } from '../../hooks/useLocalAuth'
import { getApplications, getGigs, updateApplication, updateGig, initializeLocalStorage, saveConversation } from '../../utils/localStorage'
import { triggerNotification } from '../../utils/notificationManager'
import { mockUsers } from '../../data/mockUsers'

export default function ViewApplicants() {
    const { user } = useAuth()
    const [selectedGig, setSelectedGig] = useState('')
    const [selectedApplicant, setSelectedApplicant] = useState(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(false)
    const [gigs, setGigs] = useState([])
    const [applications, setApplications] = useState([])
    const [allUsers, setAllUsers] = useState([])

    // Get all users from localStorage and mockUsers
    const getAllUsers = () => {
        try {
            const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
            const additionalUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
            const users = [...mockUsers]
            const seenEmails = new Set(mockUsers.map(u => u.email))
            for (const u of [...registeredUsers, ...additionalUsers]) {
                if (!seenEmails.has(u.email)) {
                    users.push(u)
                    seenEmails.add(u.email)
                }
            }
            return users
        } catch {
            return mockUsers
        }
    }

    // Load data from localStorage and update periodically
    useEffect(() => {
        initializeLocalStorage()

        const updateData = () => {
            setGigs(getGigs())
            setApplications(getApplications())
            setAllUsers(getAllUsers())
        }

        updateData()

        window.addEventListener('storage', updateData)
        const interval = setInterval(updateData, 2000)

        return () => {
            window.removeEventListener('storage', updateData)
            clearInterval(interval)
        }
    }, [])

    const myGigs = gigs.filter(g => g.ownerId === user?.id)
    // Default to 'all' to show everything at a glance
    const selectedGigId = selectedGig || 'all'

    // Map applications with user and gig data
    const applicants = useMemo(() => {
        return applications
            .filter(app => {
                if (selectedGigId === 'all') {
                    // Show applications for any of my gigs
                    return myGigs.some(g => g.id === app.gigId)
                }
                return app.gigId === selectedGigId
            })
            .map(app => {
                const userData = allUsers.find(u => u.id === app.userId)
                const gigData = gigs.find(g => g.id === app.gigId)
                return {
                    ...app,
                    id: app.id,
                    userId: app.userId,
                    gigId: app.gigId,
                    proposal: app.proposal,
                    attachments: app.attachments || [],
                    appliedAt: app.appliedAt,
                    status: app.status,
                    name: userData?.name || 'Unknown',
                    email: userData?.email || '',
                    phone: userData?.phone || '',
                    title: userData?.title || '',
                    location: userData?.location || '',
                    // Use gig category as skills/tags for the application, not user's profile skills
                    skills: gigData?.category ? [gigData.category] : [],
                    rating: userData?.rating || 'New',
                    totalRatings: userData?.totalRatings || 0,
                    experience: userData?.experience || '',
                    availability: userData?.availability || '',
                    schoolIdVerified: userData?.schoolIdVerified || 'unverified',
                    assessmentVerified: userData?.assessmentVerified || 'unverified',
                    appliedFor: gigData?.title || '',
                }
            })
    }, [applications, selectedGigId, gigs, allUsers])

    // Filter applicants based on search and status
    // Note: When filtering by 'hired', include both 'hired' and 'completed' to match Dashboard
    const filteredApplicants = useMemo(() => {
        return applicants.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase())
            // 'hired' filter should show both hired and completed applicants
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'hired' ? (app.status === 'hired' || app.status === 'completed') : app.status === statusFilter)
            return matchesSearch && matchesStatus
        })
    }, [applicants, searchTerm, statusFilter])

    // Count applicants by status
    // Note: 'hired' count includes both 'hired' and 'completed' to match Dashboard logic
    const statusCounts = useMemo(() => ({
        all: applicants.length,
        pending: applicants.filter(a => a.status === 'pending').length,
        hired: applicants.filter(a => a.status === 'hired' || a.status === 'completed').length,
        rejected: applicants.filter(a => a.status === 'rejected').length
    }), [applicants])

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            case 'hired':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />
            case 'hired':
                return <CheckCircle className="w-4 h-4" />
            case 'completed':
                return <CheckCircle className="w-4 h-4" />
            case 'rejected':
                return <XCircle className="w-4 h-4" />
            default:
                return null
        }
    }

    const handleViewDetails = (applicant) => {
        setSelectedApplicant(applicant)
        setIsDetailsModalOpen(true)
    }

    const handleHireApplicant = async () => {
        if (selectedApplicant) {
            const gigTitle = selectedApplicant.appliedFor
            const result = updateApplication(selectedApplicant.id, { status: 'hired' })
            if (result.success) {
                updateGig(selectedApplicant.gigId, { status: 'hired' })

                // Create conversation between client and student
                saveConversation({
                    gigId: selectedApplicant.gigId,
                    gigTitle: gigTitle,
                    participants: [user?.id, selectedApplicant.userId],
                    participantNames: {
                        [user?.id]: user?.name || 'Client',
                        [selectedApplicant.userId]: selectedApplicant.name
                    },
                    lastMessage: 'Conversation started'
                })

                // Trigger notification to student
                triggerNotification('student', 'Application Accepted! 🎉', `Congratulations! You've been hired for "${gigTitle}". You can now message the client!`, 'application')

                setIsLoading(false)
                setIsDetailsModalOpen(false)
                window.location.reload()
            }
        }
    }

    const handleRejectApplicant = async () => {
        if (selectedApplicant) {
            const gigTitle = selectedApplicant.appliedFor
            const result = updateApplication(selectedApplicant.id, { status: 'rejected' })
            if (result.success) {
                // Trigger notification to student
                triggerNotification('student', 'Application Update', `Your application for "${gigTitle}" was not selected. Keep applying!`, 'application')

                setIsLoading(false)
                setIsDetailsModalOpen(false)
                window.location.reload()
            }
        }
    }

    // Show message if no gigs
    if (myGigs.length === 0) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Applicants</h1>
                <Card className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        You haven't posted any gigs yet. Create a gig to receive applications.
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Applicants
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Review and manage all applications for your gigs
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-5 h-5" />
                    <span><strong className="text-gray-900 dark:text-white">{applicants.length}</strong> Total Applicants</span>
                </div>
            </div>

            {/* Gig Selector - Always show so user knows which gig they're viewing */}
            <Card className="p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select a gig to view applicants:
                </label>
                <select
                    value={selectedGig || selectedGigId}
                    onChange={(e) => setSelectedGig(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">All Gigs (Show Everything)</option>
                    {myGigs.map(gig => (
                        <option key={gig.id} value={gig.id}>
                            {gig.title} ({applications.filter(a => a.gigId === gig.id).length} applicants)
                        </option>
                    ))}
                </select>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setStatusFilter('all')}>
                    <div className={`text-2xl font-bold ${statusFilter === 'all' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                        {statusCounts.all}
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">All</p>
                </Card>
                <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setStatusFilter('pending')}>
                    <div className={`text-2xl font-bold ${statusFilter === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                        {statusCounts.pending}
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Pending</p>
                </Card>
                <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setStatusFilter('hired')}>
                    <div className={`text-2xl font-bold ${statusFilter === 'hired' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {statusCounts.hired}
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Hired</p>
                </Card>
                <Card className="p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setStatusFilter('rejected')}>
                    <div className={`text-2xl font-bold ${statusFilter === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {statusCounts.rejected}
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-2">Rejected</p>
                </Card>
            </div>

            {/* Search Bar */}
            <Card className="p-4">
                <Input
                    type="text"
                    placeholder="Search applicants by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </Card>

            {/* Applicants List */}
            <div className="space-y-3">
                {filteredApplicants.length > 0 ? (
                    filteredApplicants.map((applicant) => (
                        <Card key={applicant.id} className="p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                {/* Left: Avatar & Info */}
                                <div className="flex gap-4 flex-1 min-w-0">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                            {applicant.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                {applicant.name}
                                            </h3>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(applicant.status)}`}>
                                                {getStatusIcon(applicant.status)}
                                                {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            {applicant.email}
                                        </p>
                                        <p className="text-sm text-primary-600 font-medium mt-1">
                                            {applicant.title}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span>{applicant.phone}</span>
                                            <span>•</span>
                                            <span>Applied: {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>For: {applicant.appliedFor}</span>
                                        </div>
                                        {applicant.rating !== 'New' && (
                                            <div className="flex items-center gap-1 mt-2 text-xs">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {applicant.rating} ⭐
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    ({applicant.totalRatings} jobs)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Skills & Actions */}
                                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                    <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                                        {applicant.skills.slice(0, 2).map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {applicant.skills.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs font-medium">
                                                +{applicant.skills.length - 2}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewDetails(applicant)}
                                            className="flex items-center gap-1.5 whitespace-nowrap text-primary-600 border-primary-200 hover:bg-primary-50 dark:text-primary-400 dark:border-primary-900 dark:hover:bg-primary-900/20"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Application
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            No applicants found matching your filters.
                        </p>
                    </Card>
                )}
            </div>

            {/* Applicant Details Modal */}
            <ApplicantDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                applicant={selectedApplicant}
                onHire={handleHireApplicant}
                onReject={handleRejectApplicant}
                isLoading={isLoading}
                status={selectedApplicant?.status}
            />
        </div>
    )
}

