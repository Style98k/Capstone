import { useState, useEffect } from 'react'
import { mockUsers } from '../../data/mockUsers'
import { mockApplications } from '../../data/mockApplications'
import { mockTransactions } from '../../data/mockTransactions'
import { getGigs } from '../../utils/localStorage'
import StatCard from '../../components/Shared/StatCard'
import Card from '../../components/UI/Card'
import { motion } from 'framer-motion'
import {
    Users,
    Briefcase,
    FileText,
    Coins,
    GraduationCap,
    Building2,
    ShieldCheck,
    Clock,
    TrendingUp,
    Sparkles,
    Calendar,
    ArrowUpRight
} from 'lucide-react'

// Helper to get all users (mock + registered from both storage keys) - same as Home.jsx
const getAllUsers = () => {
    try {
        // Read from both quickgig_registered_users_v2 and quickgig_users_v2 for compatibility
        const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
        const additionalUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')

        // Merge all users, avoiding duplicates by email
        const allUsers = [...mockUsers]
        const seenEmails = new Set(mockUsers.map(u => u.email))

        for (const user of [...registeredUsers, ...additionalUsers]) {
            if (!seenEmails.has(user.email)) {
                allUsers.push(user)
                seenEmails.add(user.email)
            }
        }

        return allUsers
    } catch (error) {
        console.error('Error reading users:', error)
        return mockUsers
    }
}

export default function AdminDashboard() {
    const [allUsers, setAllUsers] = useState(getAllUsers())
    const [gigs, setGigs] = useState(getGigs())

    // Update data periodically to catch new registrations
    useEffect(() => {
        const updateData = () => {
            setAllUsers(getAllUsers())
            setGigs(getGigs())
        }

        // Listen for storage changes
        window.addEventListener('storage', updateData)

        // Also update periodically for same-tab changes
        const interval = setInterval(updateData, 2000)

        return () => {
            window.removeEventListener('storage', updateData)
            clearInterval(interval)
        }
    }, [])

    const totalUsers = allUsers.length
    const students = allUsers.filter(u => u.role === 'student').length
    const clients = allUsers.filter(u => u.role === 'client').length
    const activeGigs = gigs.filter(g => g.status === 'open').length
    const totalApplications = mockApplications.length
    const totalTransactions = mockTransactions.length

    // Calculate Platform Revenue from completed gigs in localStorage
    const totalEarnings = gigs
        .filter(g => g.status === 'completed' && g.platformFee)
        .reduce((acc, gig) => acc + (gig.platformFee || 0), 0)

    const pendingVerifications = allUsers.filter(u => !u.verified && u.role !== 'admin').length

    // Calculate percentages for progress bars
    const studentPercentage = totalUsers > 0 ? (students / totalUsers) * 100 : 0
    const clientPercentage = totalUsers > 0 ? (clients / totalUsers) * 100 : 0

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    }

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Welcome Banner */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

                {/* Animated sparkles */}
                <motion.div
                    className="absolute top-6 right-20"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Sparkles className="w-6 h-6 text-yellow-300/60" />
                </motion.div>
                <motion.div
                    className="absolute bottom-8 right-32"
                    animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                    <Sparkles className="w-4 h-4 text-pink-300/60" />
                </motion.div>

                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-3xl">👋</span>
                        </motion.div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    </div>
                    <p className="text-white/80 text-lg max-w-xl">
                        Overview of platform activity and statistics
                    </p>

                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
            >
                <StatCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    color="emerald"
                    trend="up"
                    trendValue="5%"
                    delay={0}
                />
                <StatCard
                    title="Active Gigs"
                    value={activeGigs}
                    icon={Briefcase}
                    color="violet"
                    delay={1}
                />
                <StatCard
                    title="Total Applications"
                    value={totalApplications}
                    icon={FileText}
                    color="amber"
                    delay={2}
                />
                <StatCard
                    title="Platform Revenue"
                    value={`₱${totalEarnings.toLocaleString()}`}
                    icon={Coins}
                    color="blue"
                    delay={3}
                />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Breakdown Card */}
                <Card delay={4}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            User Breakdown
                        </h2>
                        <motion.div
                            className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <Users className="w-5 h-5 text-indigo-600" />
                        </motion.div>
                    </div>

                    <div className="space-y-5">
                        {/* Students */}
                        <motion.div
                            className="group p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50
                hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.02, x: 4 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30
                    group-hover:shadow-emerald-500/50 transition-shadow duration-300">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-800">Students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-900">{students}</span>
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="relative h-2 bg-emerald-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${studentPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{studentPercentage.toFixed(1)}% of total users</p>
                        </motion.div>

                        {/* Clients */}
                        <motion.div
                            className="group p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100/50
                hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.02, x: 4 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30
                    group-hover:shadow-violet-500/50 transition-shadow duration-300">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-800">Clients</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-900">{clients}</span>
                                    <ArrowUpRight className="w-4 h-4 text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="relative h-2 bg-violet-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${clientPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{clientPercentage.toFixed(1)}% of total users</p>
                        </motion.div>

                        {/* Pending Verifications */}
                        <motion.div
                            className="group p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100/50
                hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.02, x: 4 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30
                    group-hover:shadow-amber-500/50 transition-shadow duration-300">
                                        <ShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-semibold text-gray-800">Pending Verifications</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.span
                                        className="text-2xl font-bold text-amber-600"
                                        animate={pendingVerifications > 0 ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        {pendingVerifications}
                                    </motion.span>
                                    {pendingVerifications > 0 && (
                                        <span className="flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Card>

                {/* Recent Activity Card */}
                <Card delay={5}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Recent Activity
                        </h2>
                        <motion.div
                            className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                        >
                            <Clock className="w-5 h-5 text-blue-600" />
                        </motion.div>
                    </div>

                    <div className="space-y-1">
                        {gigs.slice(0, 5).map((gig, index) => (
                            <motion.div
                                key={gig.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="group relative pl-8 pb-5 last:pb-0"
                            >
                                {/* Timeline line */}
                                {index < 4 && (
                                    <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-transparent" />
                                )}

                                {/* Timeline dot with glow */}
                                <div className="absolute left-0 top-1.5 w-6 h-6 flex items-center justify-center">
                                    <motion.div
                                        className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50"
                                        whileHover={{ scale: 1.5 }}
                                        animate={{
                                            boxShadow: ['0 0 10px rgba(99, 102, 241, 0.5)', '0 0 20px rgba(99, 102, 241, 0.8)', '0 0 10px rgba(99, 102, 241, 0.5)']
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>

                                <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100/50
                  group-hover:shadow-md group-hover:shadow-gray-200/50 group-hover:border-indigo-100
                  transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                                {gig.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                <p className="text-sm text-gray-500">
                                                    Posted {new Date(gig.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <motion.div
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <ArrowUpRight className="w-5 h-5 text-indigo-500" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {gigs.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </Card>
            </div>
        </motion.div>
    )
}

