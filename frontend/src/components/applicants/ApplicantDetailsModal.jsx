import { X, Star, MapPin, Mail, Phone, Award, CheckCircle, Clock, Briefcase, Shield } from 'lucide-react'
import Modal from '../UI/Modal'
import Button from '../UI/Button'

export default function ApplicantDetailsModal({ isOpen, onClose, applicant, onHire, onReject, isLoading }) {
    if (!applicant) return null

    const verificationBadges = [
        { label: 'Email', status: 'verified', icon: '✓' },
        { label: 'School ID', status: applicant.schoolIdVerified || 'unverified', icon: '📋' },
        { label: 'Assessment', status: applicant.assessmentVerified || 'unverified', icon: '📄' }
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Applicant Details" size="lg">
            <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Header with Avatar and Basic Info */}
                <div className="flex gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {applicant.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {applicant.name}
                        </h3>
                        <p className="text-primary-600 font-medium mt-1">{applicant.title || 'Student Freelancer'}</p>
                        
                        <div className="flex flex-wrap gap-3 mt-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4" />
                                {applicant.location || 'Manila, Philippines'}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {applicant.rating || 'New'} ({applicant.totalRatings || 0} jobs)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {applicant.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {applicant.phone || 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Verification Status
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {verificationBadges.map((badge) => (
                            <div
                                key={badge.label}
                                className={`p-3 rounded-lg text-center ${getStatusColor(badge.status)}`}
                            >
                                <p className="text-xs font-semibold uppercase tracking-wide">{badge.label}</p>
                                <p className="text-sm font-bold capitalize mt-1">{badge.status}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bio/Experience */}
                {applicant.experience && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary-600" />
                            About
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {applicant.experience}
                        </p>
                    </div>
                )}

                {/* Skills */}
                {applicant.skills && applicant.skills.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary-600" />
                            Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {applicant.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Availability */}
                {applicant.availability && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-semibold">Availability</p>
                            <p className="text-sm text-blue-900 dark:text-blue-300 font-medium">
                                {applicant.availability}
                            </p>
                        </div>
                    </div>
                )}

                {/* Proposal/Cover Letter */}
                {applicant.proposal && (
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Proposal</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {applicant.proposal}
                        </p>
                    </div>
                )}

                {/* Application Date */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Applied on</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {applicant.appliedDate ? new Date(applicant.appliedDate).toLocaleDateString() : 'N/A'}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="outline"
                        onClick={onReject}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={onHire}
                        disabled={isLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? 'Processing...' : 'Hire'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
