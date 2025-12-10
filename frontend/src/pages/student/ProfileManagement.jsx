import { useState, useRef } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import {
    User, Save, Camera, Star, Briefcase, TrendingUp,
    MapPin, Phone, Mail, Globe, Facebook, Calendar, Link as LinkIcon,
    ShieldCheck, Upload
} from 'lucide-react'
import Card from '../../components/UI/Card'
import Modal from '../../components/UI/Modal'
import Input from '../../components/UI/Input'
import Textarea from '../../components/UI/Textarea'
import Button from '../../components/UI/Button'

export default function ProfileManagement() {
    const { user, updateUser } = useAuth()
    const fileInputRef = useRef(null)

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    // Verification State
    const [verificationStatus, setVerificationStatus] = useState('unverified')
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
    const [idFile, setIdFile] = useState(null)

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || 'Manila, Philippines',
        title: user?.title || 'Student Freelancer',
        skills: user?.skills?.join(', ') || '',
        experience: user?.experience || '',
        availability: user?.availability || '',
        facebook: user?.facebook || '',
        otherSocial: user?.otherSocial || '',
        photo: null
    })

    const handlePhotoClick = () => {
        if (isEditing) fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSave = async () => {
        setLoading(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const updates = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        }
        // In real app, we'd upload photo here. 
        // Here we just keep the base64 string if present, or ignore it if not changed
        if (!updates.photo) delete updates.photo

        updateUser(updates)
        setLoading(false)
        setIsEditing(false)
    }

    const handleIdFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setIdFile(e.target.files[0])
        }
    }

    const handleVerifySubmit = () => {
        setVerificationStatus('pending')
        setIsVerifyModalOpen(false)
        setIdFile(null)
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your personal information and public profile presence
                    </p>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={loading} className="min-w-[120px]">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Quick Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="flex flex-col items-center text-center p-8">
                        <div className="relative group">
                            <div className={`w-40 h-40 rounded-full overflow-hidden border-4 ${isEditing ? 'border-primary-400 cursor-pointer' : 'border-white dark:border-gray-700'} shadow-2xl bg-gray-200 flex items-center justify-center transition-all duration-300`}
                                onClick={handlePhotoClick}
                            >
                                {formData.photo || user?.avatar ? (
                                    <img
                                        src={formData.photo || user.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-5xl font-bold text-gray-400">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}

                                {/* Overlay for Edit Mode */}
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute bottom-2 right-2 p-2 bg-primary-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-primary-700 transition-transform hover:scale-110" onClick={handlePhotoClick}>
                                    <Upload className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            name="profilePhoto"
                            id="profile-photo-upload"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                            {formData.name}
                        </h2>
                        <p className="text-primary-600 font-medium">{formData.title}</p>

                        <div className="mt-6 w-full grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.totalRatings || 0}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Jobs Done</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                    {user?.rating || 'New'} <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-wide">Rating</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            Verification Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Email Status</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Verified</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">School ID</span>
                                {verificationStatus === 'verified' && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Verified</span>
                                )}
                                {verificationStatus === 'pending' && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Pending Review</span>
                                )}
                                {verificationStatus === 'unverified' && (
                                    <Button
                                        size="sm"
                                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => setIsVerifyModalOpen(true)}
                                    >
                                        Upload ID
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Phone</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">Unverified</span>
                            </div>
                        </div>
                        {isEditing && (
                            <Button variant="outline" size="sm" className="w-full mt-2">
                                Manage Verifications
                            </Button>
                        )}
                    </Card>
                </div>

                {/* Right Column: Details Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card id="personal-info">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <User className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                leftIcon={User}
                            />
                            <Input
                                label="Professional Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="e.g. Computer Science Student"
                                leftIcon={Briefcase}
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                leftIcon={Mail}
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                leftIcon={Phone}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    leftIcon={MapPin}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card id="professional-info">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <Briefcase className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Professional Details</h2>
                        </div>

                        <div className="space-y-6">
                            <Textarea
                                label="Bio / Experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows={4}
                                placeholder="Tell clients about yourself, your major, and what you can do..."
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Skills (Comma separated)"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    leftIcon={Star}
                                />
                                <Input
                                    label="Availability"
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="e.g. Weekends, Mon/Wed evenings"
                                    leftIcon={Calendar}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card id="social-links">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <Globe className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Profiles</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Facebook Profile URL"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="https://facebook.com/username"
                                leftIcon={Facebook}
                            />
                            <Input
                                label="Other Social Link"
                                name="otherSocial"
                                value={formData.otherSocial}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="e.g. Instagram, Twitter"
                                leftIcon={LinkIcon}
                            />
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
                title="Verify Student Identity"
            >
                <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Please upload a clear photo of your valid School ID to verify your student status.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                        <input
                            key={isVerifyModalOpen ? 'open' : 'closed'}
                            type="file"
                            name="schoolId"
                            id="school-id-upload"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                                    Click to upload School ID
                                </span>
                                <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG</span>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsVerifyModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleVerifySubmit} disabled={!idFile}>
                            Submit
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
