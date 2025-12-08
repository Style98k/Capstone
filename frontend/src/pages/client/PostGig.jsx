import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useLocalAuth'
import { categories } from '../../data/mockGigs'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Select from '../../components/UI/Select'
import Textarea from '../../components/UI/Textarea'
import Button from '../../components/UI/Button'
import {
  Briefcase,
  MapPin,
  Clock3,
  Wallet,
  FileText,
  ListChecks,
  Sparkles,
  Send,
  XCircle,
} from 'lucide-react'

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
  const [locationMode, setLocationMode] = useState('local') // 'local' | 'online' | 'remote'
  const [showMapPicker, setShowMapPicker] = useState(false)

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
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-slate-900/60 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 uppercase tracking-[0.16em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Client workspace</span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Post a New Job
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Create a standout listing so the right student can discover and apply to your gig quickly.
          </p>
        </div>
      </div>

      <Card className="relative overflow-hidden border border-sky-100/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-sky-900/5">
        <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-sky-100 dark:bg-sky-900/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 blur-3xl" />

        <form onSubmit={handleSubmit} className="relative space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <Briefcase className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Job Title</span>
                  <span className="text-red-500">*</span>
                </span>
              }
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Math Tutoring - Algebra"
              className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
              required
            />

            <Select
              label={
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>Category</span>
                  <span className="text-red-500">*</span>
                </span>
              }
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories}
              className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Location</span>
                  <span className="text-red-500">*</span>
                </span>
                <div className="flex gap-2 text-xs">
                  {[
                    { id: 'local', label: 'Local / On-site' },
                    { id: 'online', label: 'Online' },
                    { id: 'remote', label: 'Remote / Hybrid' },
                  ].map((mode) => {
                    const isActive = locationMode === mode.id
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setLocationMode(mode.id)
                          setFormData((prev) => {
                            // If moving to online, set a friendly default text
                            if (mode.id === 'online') {
                              return {
                                ...prev,
                                location: 'Online (Zoom/Meet, etc.)',
                              }
                            }

                            // If moving away from online and the value is still the default online text,
                            // clear it so the client can type an address.
                            if (locationMode === 'online' && prev.location === 'Online (Zoom/Meet, etc.)') {
                              return {
                                ...prev,
                                location: '',
                              }
                            }

                            return prev
                          })
                        }}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-medium transition-colors duration-150 ${
                          isActive
                            ? 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-400 dark:bg-sky-950/60 dark:text-sky-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        <span>{mode.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {locationMode === 'online' ? (
                <div className="rounded-lg border border-dashed border-sky-200 bg-sky-50/60 px-4 py-3 text-xs text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
                  This job will be done <span className="font-semibold">online</span>. You can mention tools like Zoom or Google
                  Meet in the description if needed.
                </div>
              ) : (
                <Input
                  label={null}
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Type the exact address, building, or area"
                  className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100 hover:border-sky-300 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-900"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Browse map</span>
                    </button>
                  }
                />
              )}
            </div>

            <Input
              label={
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <Clock3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Duration</span>
                  <span className="text-red-500">*</span>
                </span>
              }
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 2 hours"
              className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
              required
            />

            <Input
              label={
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Budget/Pay (₱)</span>
                  <span className="text-red-500">*</span>
                </span>
              }
              name="pay"
              type="number"
              value={formData.pay}
              onChange={handleChange}
              placeholder="500"
              className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
              required
            />
          </div>

          <Input
            label={
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Short Description</span>
                <span className="text-red-500">*</span>
              </span>
            }
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            placeholder="Brief summary (shown in listings)"
            className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
            required
          />

          <Textarea
            label={
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <ListChecks className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Full Description</span>
                <span className="text-red-500">*</span>
              </span>
            }
            name="fullDesc"
            value={formData.fullDesc}
            onChange={handleChange}
            placeholder="Detailed job description, requirements, and expectations"
            rows={6}
            className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
            required
          />

          <Textarea
            label={
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <ListChecks className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Requirements (Optional)</span>
              </span>
            }
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="List any specific requirements or qualifications"
            rows={3}
            className="transition-all duration-200 focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/70 hover:border-sky-400"
          />

          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full shadow-md shadow-sky-500/20 hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post Job</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="inline-flex items-center gap-2 rounded-full border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50/80 dark:hover:bg-slate-900/80"
              onClick={() => navigate('/client/manage-gigs')}
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel</span>
            </Button>
          </div>
        </form>
      </Card>

      {showMapPicker && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
          <div className="w-full max-w-3xl mx-4 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Browse location (preview)</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowMapPicker(false)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                This is a UI preview for a future map picker. Here you can later integrate Google Maps or OpenStreetMap
                to let clients pan, zoom, and drop a pin for the exact location.
              </p>
              <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs sm:text-sm">
                Map preview area
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMapPicker(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={() => setShowMapPicker(false)}
                >
                  Use this location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

