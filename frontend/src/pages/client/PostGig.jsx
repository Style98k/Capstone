import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useLocalAuth'
import { categories, locations } from '../../data/mockGigs'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Select from '../../components/UI/Select'
import Textarea from '../../components/UI/Textarea'
import Button from '../../components/UI/Button'

export default function PostGig() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    duration: '',
    pay: '',
    shortDesc: '',
    fullDesc: '',
    requirements: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // In real app, save to backend
      console.log('Gig posted:', formData)
      setLoading(false)
      navigate('/client/manage-gigs')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post a New Job</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a job listing to find the perfect student for your task
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Math Tutoring - Algebra"
              required
            />

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              options={locations}
              required
            />

            <Input
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 2 hours"
              required
            />

            <Input
              label="Budget/Pay (₱)"
              name="pay"
              type="number"
              value={formData.pay}
              onChange={handleChange}
              placeholder="500"
              required
            />
          </div>

          <Input
            label="Short Description"
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            placeholder="Brief summary (shown in listings)"
            required
          />

          <Textarea
            label="Full Description"
            name="fullDesc"
            value={formData.fullDesc}
            onChange={handleChange}
            placeholder="Detailed job description, requirements, and expectations"
            rows={6}
            required
          />

          <Textarea
            label="Requirements (Optional)"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List any specific requirements or qualifications"
            rows={3}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/client/manage-gigs')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

