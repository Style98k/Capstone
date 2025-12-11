import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useLocalAuth'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import CommentRating from '../../components/Shared/CommentRating'
import {
    User, Mail, Phone, Building2, Save, X, Edit3,
    CheckCircle2, Sparkles, Briefcase, Star
} from 'lucide-react'

export default function ClientProfile() {
    const { user, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState(null)

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    })

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
                        {/* Avatar */}
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold shadow-2xl ring-4 ring-white/30">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <motion.div
                                className="absolute -bottom-1 -right-1 p-2 bg-violet-500 rounded-full shadow-lg"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Building2 className="w-4 h-4 text-white" />
                            </motion.div>
                        </motion.div>

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
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{user?.jobsPosted || 0}</p>
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
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{user?.studentsHired || 0}</p>
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
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {user?.rating || 'New'}
                            {user?.rating && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Ratings & Reviews Section */}
            <motion.div variants={itemVariants}>
                <CommentRating userId={user?.id} userRole={user?.role} />
            </motion.div>
        </motion.div>
    )
}
