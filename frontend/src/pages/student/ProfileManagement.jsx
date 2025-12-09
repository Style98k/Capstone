import { useState, useRef } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { User, Save, Camera, Star, Briefcase, TrendingUp } from 'lucide-react'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Textarea from '../../components/UI/Textarea'
import Button from '../../components/UI/Button'

export default function ProfileManagement() {
    const { user, updateUser } = useAuth()
    const fileInputRef = useRef(null)

    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profileData, setProfileData] = useState({
        skills: user?.skills?.join(', ') || '',
        experience: user?.experience || '',
        availability: user?.availability || '',
        photo: null
    })

    // Mock Photo Upload
    const handlePhotoClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, photo: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleProfileChange = (e) => {
        setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSaveProfile = () => {
        const updates = {
            ...profileData,
            skills: profileData.skills.split(',').map(s => s.trim()).filter(Boolean),
        }
        delete updates.photo

        updateUser(updates)
        setIsEditingProfile(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Profile Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Update your professional details and availability to get hired faster
                    </p>
                </div>
            </div>

            <Card className="border-t-4 border-primary-500">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Details</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your public profile information</p>
                        </div>
                    </div>
                    <Button
                        variant={isEditingProfile ? 'outline' : 'primary'}
                        onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                        className="flex items-center gap-2 group"
                    >
                        {isEditingProfile ? (
                            <>
                                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Save Changes
                            </>
                        ) : (
                            'Edit Profile'
                        )}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Photo Section */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary-400 transition-colors group relative overflow-hidden">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg mb-4 bg-gray-200 flex items-center justify-center">
                                {profileData.photo || user?.avatar ? (
                                    <img
                                        src={profileData.photo || user.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-5xl font-bold text-gray-400">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {isEditingProfile && (
                                <button
                                    onClick={handlePhotoClick}
                                    className="absolute bottom-6 right-2 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 hover:scale-110 transition-all"
                                    title="Upload Photo"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="text-center mt-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user?.email}</p>
                            {isEditingProfile && (
                                <p className="text-xs text-primary-500 font-medium animate-pulse cursor-pointer hover:underline" onClick={handlePhotoClick}>
                                    Click to change photo
                                </p>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={!isEditingProfile}
                        />
                    </div>

                    {/* Details Section */}
                    <div className="md:col-span-8 space-y-5">
                        <div className="grid grid-cols-1 gap-5">
                            <Input
                                label="Display Name"
                                value={user?.name || ''}
                                disabled
                                className="bg-gray-50 opacity-70"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="group">
                                <Input
                                    label="Skills"
                                    name="skills"
                                    value={profileData.skills}
                                    onChange={handleProfileChange}
                                    disabled={!isEditingProfile}
                                    placeholder="e.g. Graphic Design, Python, Tutoring"
                                    leftIcon={Star}
                                    className="transition-all focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="group">
                                <Input
                                    label="Availability"
                                    name="availability"
                                    value={profileData.availability}
                                    onChange={handleProfileChange}
                                    disabled={!isEditingProfile}
                                    placeholder="e.g. Mon-Wed after 4PM, Weekends"
                                    leftIcon={Briefcase}
                                    className="transition-all focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <Textarea
                                label="Experience / Bio"
                                name="experience"
                                value={profileData.experience}
                                onChange={handleProfileChange}
                                disabled={!isEditingProfile}
                                placeholder="Tell clients about your past work or why they should hire you..."
                                rows={5}
                                className="resize-none transition-all focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {!isEditingProfile && (
                            <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3 border border-blue-100 dark:border-blue-800">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded text-blue-600 dark:text-blue-300">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Pro Tip</h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                        Students with detailed profiles and photos get 3x more gig offers. Keep this updated!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}
