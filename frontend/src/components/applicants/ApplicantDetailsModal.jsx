import { useMemo } from 'react'
import { Star, MapPin, Mail, Phone, CheckCircle, Shield, Download, FileText, Image as ImageIcon, MessageSquare, Paperclip, BadgeCheck, Calendar } from 'lucide-react'
import Modal from '../UI/Modal'
import Button from '../UI/Button'
import { mockUsers } from '../../data/mockUsers'

/**
 * Fetches fresh verification status for a user from localStorage.
 * Mirrors the admin's getUserVerificationStatus logic so badge colors
 * always reflect the latest admin approvals.
 */
function getFreshVerificationStatus(userId) {
    try {
        const statuses = JSON.parse(localStorage.getItem('quickgig_user_verification_statuses_v2') || '{}')
        const nbiStatus = localStorage.getItem(`nbiStatus_${userId}`) || 'unverified'
        const idStatus = localStorage.getItem(`idStatus_${userId}`) || 'unverified'

        const users = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
        const user = users.find(u => u.id === userId)
        const userVerified = user?.verified

        if (statuses[userId]) {
            return {
                verificationStatus: statuses[userId].verificationStatus || 'unverified',
                assessmentStatus: statuses[userId].assessmentStatus || 'unverified',
                nbiStatus,
                idStatus,
                verified: userVerified
            }
        }

        // Fallback: derive from the user object in storage
        const isVerified = userVerified === 'verified' || userVerified === true
        return {
            verificationStatus: isVerified ? 'verified' : 'unverified',
            assessmentStatus: isVerified ? 'verified' : 'unverified',
            nbiStatus,
            idStatus,
            verified: userVerified
        }
    } catch {
        return {
            verificationStatus: 'unverified',
            assessmentStatus: 'unverified',
            nbiStatus: 'unverified',
            idStatus: 'unverified',
            verified: false
        }
    }
}

/**
 * Fetches the full, freshest user object by merging mockUsers,
 * quickgig_users_v2, and quickgig_registered_users_v2.
 */
function getFreshUserData(userId) {
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
        const additionalUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
        const allUsers = [...mockUsers, ...registeredUsers, ...additionalUsers]
        // Later entries win so localStorage edits override mocks
        const seenIds = new Map()
        for (const u of allUsers) {
            if (u.id) seenIds.set(u.id, { ...seenIds.get(u.id), ...u })
        }
        return seenIds.get(userId) || null
    } catch {
        return null
    }
}

export default function ApplicantDetailsModal({ isOpen, onClose, applicant, onHire, onReject, isLoading, status }) {
    // ── Dynamic data: always fetch fresh on every render ──
    const freshData = useMemo(() => {
        if (!applicant) return null
        const userId = applicant.userId
        const freshUser = getFreshUserData(userId)
        const vStatus = getFreshVerificationStatus(userId)
        return { freshUser, vStatus }
    }, [applicant, isOpen])

    if (!applicant || !freshData) return null

    const { freshUser, vStatus } = freshData

    // Merge fresh user data with application data
    const name = freshUser?.name || applicant.name || 'Unknown'
    const title = freshUser?.title || applicant.title || 'Student Freelancer'
    const email = freshUser?.email || applicant.email || ''
    const phone = freshUser?.phone || applicant.phone || ''
    const location = freshUser?.location || applicant.location || 'Philippines'
    const rating = freshUser?.rating || applicant.rating || 'New'
    const totalRatings = freshUser?.totalRatings || applicant.totalRatings || 0
    const profilePhoto = freshUser?.profilePhoto || null

    // Determine "fully verified" for the blue badge
    const isFullyVerified =
        vStatus.verificationStatus === 'verified' &&
        vStatus.assessmentStatus === 'verified' &&
        vStatus.nbiStatus === 'verified'

    // ── Verification Checklist ──
    const verificationItems = [
        { label: 'Email', status: vStatus.verified === 'verified' || vStatus.verified === true ? 'verified' : 'unverified' },
        { label: 'School ID', status: vStatus.idStatus || vStatus.verificationStatus || 'unverified' },
        { label: 'Assessment', status: vStatus.assessmentStatus || 'unverified' },
        { label: 'NBI', status: vStatus.nbiStatus || 'unverified' }
    ]

    // ── Attachments ──
    const imageAttachments = (applicant.attachments || []).filter(f => {
        const ext = f.name?.split('.').pop()?.toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
    })
    const fileAttachments = (applicant.attachments || []).filter(f => {
        const ext = f.name?.split('.').pop()?.toLowerCase()
        return !['jpg', 'jpeg', 'png', 'gif'].includes(ext)
    })

    const handleDownloadFile = (file) => {
        if (file.data) {
            const link = document.createElement('a')
            link.href = file.data
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const getFileIcon = (fileName) => {
        const extension = fileName?.split('.').pop()?.toLowerCase()
        if (['pdf'].includes(extension)) return <FileText className="w-4 h-4 text-red-500" />
        if (['doc', 'docx'].includes(extension)) return <FileText className="w-4 h-4 text-blue-600" />
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return <ImageIcon className="w-4 h-4 text-emerald-500" />
        return <FileText className="w-4 h-4 text-slate-400" />
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
            <div className="space-y-6">

                {/* ═══════════════════════════════════════════════
                    HEADER — Avatar, Name, Title, Verified Badge
                ═══════════════════════════════════════════════ */}
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt={name}
                                className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-slate-100 dark:ring-slate-700">
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Name + Title + Meta Row */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                {name}
                            </h3>
                            {isFullyVerified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{title}</p>

                        {/* Rating + Location row */}
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="font-semibold text-slate-800 dark:text-white">
                                    {rating !== 'New' ? rating : '—'}
                                </span>
                                <span className="text-slate-400 dark:text-slate-500">
                                    ({totalRatings} {totalRatings === 1 ? 'job' : 'jobs'})
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {location}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    CONTACT ROW — Email & Phone, minimal icons
                ═══════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 py-4 border-t border-b border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">Email</p>
                            <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{email || '—'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">Phone</p>
                            <p className="text-sm text-slate-700 dark:text-slate-200">{phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    VERIFICATION CHECKLIST — Pill Badges Row
                ═══════════════════════════════════════════════ */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Verification Status
                        </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {verificationItems.map((item) => {
                            const isVerified = item.status === 'verified'
                            return (
                                <span
                                    key={item.label}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${isVerified
                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                        : 'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                        }`}
                                >
                                    <CheckCircle className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                                    {item.label}
                                </span>
                            )
                        })}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    PROPOSAL — Message from Applicant
                ═══════════════════════════════════════════════ */}
                {applicant.proposal && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Application Proposal
                            </h4>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {applicant.proposal}
                            </p>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    ATTACHMENTS — Clickable File Links
                ═══════════════════════════════════════════════ */}
                {(imageAttachments.length > 0 || fileAttachments.length > 0) && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Paperclip className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Attachments
                            </h4>
                        </div>

                        {/* Image thumbnails */}
                        {imageAttachments.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {imageAttachments.map((file, idx) => (
                                    <div
                                        key={idx}
                                        className="relative rounded-lg overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800 cursor-pointer group border border-slate-100 dark:border-slate-700"
                                        onClick={() => handleDownloadFile(file)}
                                    >
                                        {file.data ? (
                                            <>
                                                <img
                                                    src={file.data}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e2e8f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%2394a3b8"%3ENo Image%3C/text%3E%3C/svg%3E'
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                                    <Download className="w-5 h-5 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-slate-400 text-xs">No preview</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* File links */}
                        {fileAttachments.length > 0 && (
                            <div className="space-y-1.5">
                                {fileAttachments.map((file, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleDownloadFile(file)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left"
                                    >
                                        {getFileIcon(file.name)}
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate flex-1">
                                            {file.name}
                                        </span>
                                        {file.size && (
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                                                {file.size} KB
                                            </span>
                                        )}
                                        <Download className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════
                    APPLIED DATE — Subtle row
                ═══════════════════════════════════════════════ */}
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Applied {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    {applicant.appliedFor && (
                        <>
                            <span className="mx-1">•</span>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">{applicant.appliedFor}</span>
                        </>
                    )}
                </div>

                {/* ═══════════════════════════════════════════════
                    ACTION FOOTER — Reject (Ghost) / Hire (Solid)
                ═══════════════════════════════════════════════ */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    {status === 'pending' ? (
                        <>
                            <button
                                onClick={onReject}
                                disabled={isLoading}
                                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold
                                    border border-red-200 text-red-600
                                    hover:bg-red-50 hover:border-red-300
                                    dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all duration-150"
                            >
                                Reject
                            </button>
                            <button
                                onClick={onHire}
                                disabled={isLoading}
                                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold
                                    bg-emerald-600 text-white
                                    hover:bg-emerald-700 active:bg-emerald-800
                                    dark:bg-emerald-600 dark:hover:bg-emerald-700
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    shadow-sm hover:shadow transition-all duration-150"
                            >
                                {isLoading ? 'Processing…' : 'Hire'}
                            </button>
                        </>
                    ) : (
                        <div className={`flex-1 text-center py-3 rounded-lg text-sm font-semibold ${status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : status === 'hired'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                : status === 'rejected'
                                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                    : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                            {status === 'completed' ? '✓ Gig Completed'
                                : status === 'hired' ? '✓ Hired for this Gig'
                                    : status === 'rejected' ? '✗ Application Rejected'
                                        : status?.charAt(0).toUpperCase() + status?.slice(1)}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}
