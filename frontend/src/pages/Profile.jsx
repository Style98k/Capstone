import { useState } from 'react'
import { useAuth } from '../hooks/useLocalAuth'
import Card from '../components/UI/Card'
import Input from '../components/UI/Input'
import Button from '../components/UI/Button'
import CommentRating from '../components/Shared/CommentRating'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || '',
    availability: user?.availability || '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    const updates = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    }
    updateUser(updates)
    setEditing(false)
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your profile information
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <Button
            variant={editing ? 'outline' : 'primary'}
            onClick={() => (editing ? handleSave() : setEditing(true))}
          >
            {editing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!editing}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editing}
          />
          {user.role === 'student' && (
            <>
              <Input
                label="School ID"
                value={user.schoolId || ''}
                disabled
              />
              <Input
                label="Skills (comma-separated)"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                disabled={!editing}
              />
              <Input
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                disabled={!editing}
              />
              <Input
                label="Availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                disabled={!editing}
              />
            </>
          )}
        </div>
      </Card>

      {/* Ratings & Reviews Section */}
      <CommentRating userId={user.id} userRole={user.role} />
    </div>
  )
}

