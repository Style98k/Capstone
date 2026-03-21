import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useLocalAuth'
import { getGigs, getApplications } from '../../utils/localStorage'
import { getUserRating } from '../../utils/ratingUtils'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Modal from '../../components/UI/Modal'
import CommentRating from '../../components/Shared/CommentRating'
import { triggerNotification } from '../../utils/notificationManager'
import {
    User, Mail, Phone, Building2, Save, X, Edit3,
    CheckCircle2, Sparkles, Briefcase, Star, Camera, ShieldCheck, Upload
} from 'lucide-react'

export default function ClientProfile() {
    const { user, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState(null)
    const [stats, setStats] = useState({ jobsPosted: 0, studentsHired: 0 })
    const [ratingData, setRatingData] = useState({ average: 0, count: 0, reviews: [] })
    const fileInputRef = useRef(null)

    // Valid ID State
    const [idStatus, setIdStatus] = useState(() => {
        return localStorage.getItem(`idStatus_${user?.id}`) || 'unverified'
    })
    const [isIdModalOpen, setIsIdModalOpen] = useState(false)
    const [idFile, setIdFile] = useState(null)

    // NBI Clearance State
    const [nbiStatus, setNbiStatus] = useState(() => {
        return localStorage.getItem(`nbiStatus_${user?.id}`) || 'unverified'
    })
    const [isNbiModalOpen, setIsNbiModalOpen] = useState(false)
    const [nbiFile, setNbiFile] = useState(null)

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    })

    // Fetch real stats from localStorage
    useEffect(() => {
        const updateStats = () => {
            const allGigs = getGigs()
            const allApplications = getApplications()

            const myGigs = allGigs.filter(g => g.ownerId === user?.id)
            const jobsPosted = myGigs.length
            const studentsHired = allApplications.filter(app =>
                myGigs.some(g => g.id === app.gigId) && (app.status === 'hired' || app.status === 'completed')
            ).length

            setStats({ jobsPosted, studentsHired })

            // Update rating data
            if (user?.id) {
                const ratings = getUserRating(user.id)
                setRatingData(ratings)
            }
        }

        updateStats()

        window.addEventListener('storage', updateStats)
        const interval = setInterval(updateStats, 2000)

        return () => {
            window.removeEventListener('storage', updateStats)
            clearInterval(interval)
        }
    }, [user?.id])

    // Sync ID status
    useEffect(() => {
        const storedIdStatus = localStorage.getItem(`idStatus_${user?.id}`)
        if (storedIdStatus) {
            setIdStatus(storedIdStatus)
        }
    }, [user?.id])

    // Sync NBI status
    useEffect(() => {
        const storedNbiStatus = localStorage.getItem(`nbiStatus_${user?.id}`)
        if (storedNbiStatus) {
            setNbiStatus(storedNbiStatus)
        }
    }, [user?.id])

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSave = async () => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 600))
        updateUser(formData)
        setLoading(false)
        setIsEditing(false)
        setNotification({ type: 'success', message: 'Profile updated successfully!' })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        })
        setIsEditing(false)
    }

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setNotification({ type: 'error', message: 'Please select an image file' })
                setTimeout(() => setNotification(null), 3000)
                return
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setNotification({ type: 'error', message: 'Image must be less than 2MB' })
                setTimeout(() => setNotification(null), 3000)
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                // Save to user profile
                updateUser({ profilePhoto: reader.result })
                setNotification({ type: 'success', message: 'Profile photo updated!' })
                setTimeout(() => setNotification(null), 3000)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleNbiFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setNotification({ type: 'error', message: 'Image must be less than 2MB' })
            setTimeout(() => setNotification(null), 3000)
            e.target.value = ''
            return
        }

        setNbiFile(file)

        const reader = new FileReader()
        reader.onload = (event) => {
            localStorage.setItem(`nbiImage_${user.id}`, event.target.result)
        }
        reader.onerror = () => {
            setNotification({ type: 'error', message: 'Error reading file' })
            setTimeout(() => setNotification(null), 3000)
            setNbiFile(null)
        }
        reader.readAsDataURL(file)
    }

    const handleIdFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setNotification({ type: 'error', message: 'Image must be less than 2MB' })
            setTimeout(() => setNotification(null), 3000)
            e.target.value = ''
            return
        }

        setIdFile(file)

        const reader = new FileReader()
        reader.onload = (event) => {
            localStorage.setItem(`clientIDImage_${user.id}`, event.target.result)
        }
        reader.onerror = () => {
            setNotification({ type: 'error', message: 'Error reading file' })
            setTimeout(() => setNotification(null), 3000)
            setIdFile(null)
        }
        reader.readAsDataURL(file)
    }

    const handleIdSubmit = () => {
        if (!idFile) return

        const newIdStatus = 'pending'
        setIdStatus(newIdStatus)

        // Save ID status
        localStorage.setItem(`idStatus_${user.id}`, newIdStatus)

        // Save per-user verification status
        try {
            const statuses = JSON.parse(localStorage.getItem('quickgig_user_verification_statuses_v2') || '{}')
            statuses[user.id] = { ...statuses[user.id], idStatus: newIdStatus }
            localStorage.setItem('quickgig_user_verification_statuses_v2', JSON.stringify(statuses))
        } catch (e) {
            console.error('Error saving verification status:', e)
        }

        // Update user's verified status to 'pending'
        try {
            const users = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
            const userIndex = users.findIndex(u => u.id === user.id)
            if (userIndex !== -1) {
                users[userIndex].verified = 'pending'
                users[userIndex].idStatus = newIdStatus
                localStorage.setItem('quickgig_users_v2', JSON.stringify(users))
            }

            const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
            const regIndex = registeredUsers.findIndex(u => u.id === user.id)
            if (regIndex !== -1) {
                registeredUsers[regIndex].verified = 'pending'
                registeredUsers[regIndex].idStatus = newIdStatus
                localStorage.setItem('quickgig_registered_users_v2', JSON.stringify(registeredUsers))
            }

            window.dispatchEvent(new Event('storage'))
        } catch (e) {
            console.error('Error updating verified status:', e)
        }

        // Send notification to admin
        triggerNotification('admin', 'Verification Request', `${user.name} uploaded a Valid ID for review.`, 'verification', null)

        setIsIdModalOpen(false)
        setIdFile(null)

        setNotification({ type: 'success', message: 'Valid ID uploaded successfully! Pending review.' })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleNbiSubmit = () => {
        if (!nbiFile) return

        const newNbiStatus = 'pending'
        setNbiStatus(newNbiStatus)

        // Save NBI status
        localStorage.setItem(`nbiStatus_${user.id}`, newNbiStatus)

        // Save per-user verification status
        try {
            const statuses = JSON.parse(localStorage.getItem('quickgig_user_verification_statuses_v2') || '{}')
            statuses[user.id] = { ...statuses[user.id], nbiStatus: newNbiStatus }
            localStorage.setItem('quickgig_user_verification_statuses_v2', JSON.stringify(statuses))
        } catch (e) {
            console.error('Error saving verification status:', e)
        }

        // Update user's verified status to 'pending'
        try {
            const users = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
            const userIndex = users.findIndex(u => u.id === user.id)
            if (userIndex !== -1) {
                users[userIndex].verified = 'pending'
                localStorage.setItem('quickgig_users_v2', JSON.stringify(users))
            }

            const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
            const regIndex = registeredUsers.findIndex(u => u.id === user.id)
            if (regIndex !== -1) {
                registeredUsers[regIndex].verified = 'pending'
                localStorage.setItem('quickgig_registered_users_v2', JSON.stringify(registeredUsers))
            }

            window.dispatchEvent(new Event('storage'))
        } catch (e) {
            console.error('Error updating verified status:', e)
        }

        // Send notification to admin
        triggerNotification('admin', 'NBI Uploaded', `${user.name} submitted their NBI clearance for verification.`, 'verification')

        setIsNbiModalOpen(false)
        setNbiFile(null)

        setNotification({ type: 'success', message: 'NBI Clearance uploaded successfully! Pending review.' })
        setTimeout(() => setNotification(null), 3000)
    }

    if (!user) return null

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto space-y-6 pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-24 right-4 md:right-8 z-50"
                >
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 border-green-500 bg-white dark:bg-gray-800">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {notification.message}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Header Banner */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-white"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

                <motion.div
                    className="absolute top-6 right-20"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Sparkles className="w-6 h-6 text-yellow-300/60" />
                </motion.div>

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        {/* Avatar with Photo Upload */}
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />

                            {/* Image / Initial Placeholder */}
                            {user.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full object-cover border-4 border-white shadow-md bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <label
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </label>

                            {/* Small Camera Button (Bottom Right) */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-blue-700"
                            >
                                <Camera className="w-4 h-4" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-white/80 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur">
                                <Building2 className="w-3.5 h-3.5" />
                                Client
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-200 backdrop-blur"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </motion.button>
                            </>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Profile Information Card */}
            <motion.div variants={itemVariants}>
                <Card className="overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <motion.div
                            className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <User className="w-5 h-5 text-white" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Personal Information
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: isEditing ? 1.02 : 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                leftIcon={User}
                                className={isEditing ? 'ring-2 ring-violet-200 dark:ring-violet-800' : ''}
                            />
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: isEditing ? 1.02 : 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                leftIcon={Mail}
                                className={isEditing ? 'ring-2 ring-violet-200 dark:ring-violet-800' : ''}
                            />
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: isEditing ? 1.02 : 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="md:col-span-2"
                        >
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                leftIcon={Phone}
                                className={isEditing ? 'ring-2 ring-violet-200 dark:ring-violet-800' : ''}
                            />
                        </motion.div>
                    </div>
                </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30 cursor-pointer"
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Jobs Posted</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.jobsPosted}</p>
                    </motion.div>

                    <motion.div
                        className="group p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/30 cursor-pointer"
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-violet-500 text-white shadow-lg shadow-violet-500/30">
                                <User className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Students Hired</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.studentsHired}</p>
                    </motion.div>

                    <motion.div
                        className="group p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30 cursor-pointer"
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                                <Star className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {ratingData.count > 0 ? `${ratingData.count} Reviews` : 'No ratings yet'}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {ratingData.count > 0 ? ratingData.average : 'New'}
                            {ratingData.count > 0 && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Verification Status Card */}
            <motion.div variants={itemVariants}>
                <Card className="overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <motion.div
                            className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Verification Status
                        </h2>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Email Status</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Verified</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Valid ID</span>
                            {idStatus === 'verified' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Verified</span>
                            )}
                            {idStatus === 'pending' && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Pending Review</span>
                            )}
                            {(!idStatus || idStatus === 'unverified') && (
                                <Button
                                    size="sm"
                                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => setIsIdModalOpen(true)}
                                >
                                    Upload ID
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">NBI Clearance</span>
                            {nbiStatus === 'verified' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Verified</span>
                            )}
                            {nbiStatus === 'pending' && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Pending Review</span>
                            )}
                            {nbiStatus === 'unverified' && (
                                <Button
                                    size="sm"
                                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => setIsNbiModalOpen(true)}
                                >
                                    Upload NBI
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Ratings & Reviews Section */}
            <motion.div variants={itemVariants}>
                <CommentRating userId={user?.id} userRole={user?.role} />
            </motion.div>

            {/* NBI Upload Modal */}
            <Modal
                isOpen={isNbiModalOpen}
                onClose={() => setIsNbiModalOpen(false)}
                title="Upload NBI Clearance"
            >
                <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Please upload a clear photo or scan of your valid NBI Clearance to verify your identity.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                        <input
                            key={isNbiModalOpen ? 'open' : 'closed'}
                            type="file"
                            name="nbiClearance"
                            id="nbi-clearance-upload-client"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept="image/*"
                            onChange={handleNbiFileChange}
                        />
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-3">
                            <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        {nbiFile ? (
                            <>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                                    {nbiFile.name}
                                </span>
                                <span className="text-xs text-green-500 mt-1">File selected</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Click to upload NBI Clearance
                                </span>
                                <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG</span>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsNbiModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleNbiSubmit} disabled={!nbiFile}>
                            Submit
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Valid ID Upload Modal */}
            <Modal
                isOpen={isIdModalOpen}
                onClose={() => setIsIdModalOpen(false)}
                title="Upload Valid ID"
            >
                <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Please upload a clear photo or scan of your valid Government-issued ID to verify your identity.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                        <input
                            key={isIdModalOpen ? 'open' : 'closed'}
                            type="file"
                            name="validId"
                            id="valid-id-upload-client"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept="image/*"
                            onChange={handleIdFileChange}
                        />
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-3">
                            <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        {idFile ? (
                            <>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                                    {idFile.name}
                                </span>
                                <span className="text-xs text-green-500 mt-1">File selected</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Click to upload Valid ID
                                </span>
                                <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG</span>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsIdModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleIdSubmit} disabled={!idFile}>
                            Submit
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    )
}
