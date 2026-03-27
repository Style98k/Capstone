import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useLocalAuth'
import { getGigs, getApplications, saveApplication, initializeLocalStorage } from '../utils/localStorage'
import { triggerNotification } from '../utils/notificationManager'
import { getUserRating } from '../utils/ratingUtils'
import { mockUsers } from '../data/mockUsers'
import Modal from '../components/UI/Modal'
import { MapPin, Clock, User, FileText, AlertTriangle, Upload, BadgeCheck, Star, ExternalLink, Users, Calendar, ChevronLeft, Briefcase } from 'lucide-react'
import { useState, useRef, useMemo } from 'react'

export default function GigDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showClientProfileModal, setShowClientProfileModal] = useState(false)
  const [proposal, setProposal] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isManagingAttachments, setIsManagingAttachments] = useState(false)
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([])
  const fileInputRef = useRef(null)

  const gigs = useMemo(() => {
    initializeLocalStorage()
    return getGigs()
  }, [])

  const applications = useMemo(() => getApplications(), [])

  const gig = gigs.find(g => g.id === id)
  const hasApplied = user && applications.some(app => app.gigId === id && app.userId === user.id)

  const clientInfo = useMemo(() => {
    if (!gig?.ownerId) return null
    const storedUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
    const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
    const allUsers = [...mockUsers, ...storedUsers, ...registeredUsers]
    const client = allUsers.find(u => u.id === gig.ownerId)
    if (!client) return null
    const ratingData = getUserRating(gig.ownerId)
    return {
      id: client.id,
      name: client.name || 'Unknown Client',
      email: client.email,
      phone: client.phoneNumber || client.phone || null,
      verified: client.verified === true || client.verified === 'verified',
      rating: ratingData.average || 0,
      reviewCount: ratingData.count || 0,
    }
  }, [gig])

  if (!gig) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-sm mb-4">Gig not found.</p>
        <Link to="/gigs">
          <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Back to Gigs
          </button>
        </Link>
      </div>
    )
  }

  const applicantCount = applications.filter(app => app.gigId === id).length

  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const statusLabel = gig.status === 'open' ? 'Open' : gig.status === 'in_progress' ? 'In Progress' : gig.status || 'Open'
  const statusColor =
    gig.status === 'open'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : gig.status === 'in_progress'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-slate-100 text-slate-600 border-slate-200'

  const handleApply = () => {
    if (proposal.trim()) {
      const applicationData = {
        gigId: id,
        userId: user.id,
        proposal,
        attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type, data: f.data })),
      }
      const result = saveApplication(applicationData)
      if (result.success) {
        triggerNotification('client', 'New Applicant! 📩', `A student applied for "${gig.title}". Review their application now.`, 'application')
        setShowApplyModal(false)
        setProposal('')
        setAttachments([])
        alert('Application submitted successfully!')
        window.location.reload()
      } else {
        alert('Failed to submit application. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* ── Top Nav: Back Link ── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back to browse
      </button>

      {/* ── Main Grid ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ════ LEFT: Main Content ════ */}
        <div className="flex-1 min-w-0">

          {/* ── Header Card ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-7 mb-5">
            {/* Category pill */}
            <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium tracking-wide mb-4">
              {gig.category}
            </span>

            {/* Job Title */}
            <h1 className="text-3xl font-bold text-slate-900 leading-snug mb-4">
              {gig.title}
            </h1>

            {/* Client + Location row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-5">
              <button
                onClick={() => setShowClientProfileModal(true)}
                className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                <span>{clientInfo?.name || gig.company || 'Client'}</span>
                {clientInfo?.verified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                )}
              </button>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {gig.location}
              </span>
            </div>

            {/* Metadata action row */}
            <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100">
              {/* Applicants */}
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                <Users className="w-3.5 h-3.5" />
                {applicantCount} Applicant{applicantCount !== 1 ? 's' : ''}
              </span>

              {/* Posted date */}
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Posted {formatPostedDate(gig.createdAt)}
              </span>

              {/* Duration */}
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
                <Clock className="w-3.5 h-3.5" />
                {gig.duration}
              </span>

              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-3 py-1.5 ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* ── About the Gig ── */}
          <div className="bg-white border border-slate-200 rounded-xl p-7 mb-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              About the Gig
            </h2>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed text-sm">
              {gig.fullDesc || gig.shortDesc}
            </p>
          </div>

          {/* ── Reference Image ── */}
          {gig.imageUrl && (
            <div className="bg-white border border-slate-200 rounded-xl p-7 mb-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Reference Image</h2>
              <img
                src={gig.imageUrl}
                alt="Reference for this gig"
                className="w-full max-h-80 object-cover rounded-lg border border-slate-200"
              />
            </div>
          )}

          {/* ── Requirements ── */}
          {gig.requirements && gig.requirements.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-7">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Requirements</h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(gig.requirements) ? (
                  gig.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-sm font-medium"
                    >
                      {req}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-sm font-medium">
                    {gig.requirements}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ════ RIGHT: Pricing / Apply Sidebar ════ */}
        <div className="lg:w-72 flex-shrink-0 w-full">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-24">

            {/* Budget */}
            <div className="text-center pb-5 mb-5 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">TOTAL PAY</p>
              <p className="text-4xl font-bold text-slate-900">
                ₱{(gig.pay || 0).toLocaleString()}
              </p>

            </div>

            {/* CTAs */}
            <div className="space-y-3">
              {/* Verification warning */}
              {user && user.role === 'student' && !(user.verified === true || user.verified === 'verified') && !hasApplied && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-snug">
                    Verify your account to apply for gigs.
                  </p>
                </div>
              )}

              {/* Apply button — student, verified, not yet applied */}
              {user && user.role === 'student' && !hasApplied && (
                (user.verified === true || user.verified === 'verified') ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    Apply for this Gig
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-slate-200 text-slate-400 rounded-lg text-sm font-semibold cursor-not-allowed"
                  >
                    Verify Account to Apply
                  </button>
                )
              )}

              {/* Already applied */}
              {hasApplied && (
                <div className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold text-center">
                  ✓ Application Submitted
                </div>
              )}

              {/* Not logged in */}
              {!user && (
                <Link to="/login" className="block">
                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
                    Login to Apply
                  </button>
                </Link>
              )}


            </div>

            {/* Client rating teaser */}
            {clientInfo && clientInfo.rating > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= Math.round(clientInfo.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">{clientInfo.rating} · {clientInfo.reviewCount} reviews</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ════ Apply Modal ════ */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Gig" size="lg">
        <div className="space-y-5 bg-white">

          {/* Client Spotlight */}
          <div className="border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Client</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 text-sm">{clientInfo?.name || gig.company || 'Client'}</span>
                    {clientInfo?.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    {clientInfo?.rating > 0 ? (
                      <>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{clientInfo.rating} ({clientInfo.reviewCount} reviews)</span>
                      </>
                    ) : (
                      <span>No ratings yet</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowClientProfileModal(true)}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                View Profile
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Gig Title */}
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Applying For</p>
            <h3 className="text-lg font-semibold text-slate-900">{gig.title}</h3>
          </div>

          {/* Attachments */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Attachments (Optional)</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-dashed border-2 border-slate-200 rounded-lg p-5 text-center hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Click to upload files</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOC, images, or portfolio links</p>
            </button>
          </div>

          <input
            type="file"
            name="attachments"
            id="attachment-upload"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*,.txt,.zip"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (files.length === 0) return
              files.forEach(file => {
                const reader = new FileReader()
                reader.onload = (event) => {
                  setAttachments(prev => {
                    const key = `${file.name}-${file.size}`
                    if (prev.some(f => `${f.name}-${f.size}` === key)) return prev
                    return [...prev, { name: file.name, size: Math.round(file.size / 1024), type: file.type, data: event.target.result }]
                  })
                }
                reader.readAsDataURL(file)
              })
              setIsManagingAttachments(false)
              setAttachmentsToRemove([])
              e.target.value = ''
            }}
          />

          {/* File List */}
          {attachments.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-700">{attachments.length} file{attachments.length > 1 ? 's' : ''} selected</p>
                {!isManagingAttachments ? (
                  <button type="button" onClick={() => { setIsManagingAttachments(true); setAttachmentsToRemove([]) }} className="text-xs font-medium text-slate-500 hover:text-slate-700">Manage</button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (attachmentsToRemove.length === 0) { setIsManagingAttachments(false); return }
                        setAttachments(prev => prev.filter((_, idx) => !attachmentsToRemove.includes(idx)))
                        setAttachmentsToRemove([])
                        setIsManagingAttachments(false)
                      }}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >Remove</button>
                    <button type="button" onClick={() => { setIsManagingAttachments(false); setAttachmentsToRemove([]) }} className="text-xs text-slate-500 hover:text-slate-700">Done</button>
                  </div>
                )}
              </div>
              <ul className="space-y-1">
                {attachments.map((file, idx) => {
                  const checked = attachmentsToRemove.includes(idx)
                  return (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 py-1 px-2 rounded hover:bg-slate-50">
                      {isManagingAttachments && (
                        <input
                          type="checkbox"
                          name={`remove-attachment-${idx}`}
                          id={`remove-attachment-${idx}`}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                          checked={checked}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            setAttachmentsToRemove(prev => isChecked ? [...prev, idx] : prev.filter(id => id !== idx))
                          }}
                        />
                      )}
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Proposal */}
          <div>
            <label htmlFor="gig-proposal" className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Your Proposal
            </label>
            <textarea
              id="gig-proposal"
              name="proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Tell the client why you're a great fit, your relevant experience, and when you can start..."
              rows={6}
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-all resize-none text-sm"
            />
          </div>

          {/* Applying As */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500">
              Applying as: <span className="font-medium text-slate-700">{user?.name}</span> ({user?.email})
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowApplyModal(false)}
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!proposal.trim()}
              className="w-full sm:flex-1 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              Submit Application
            </button>
          </div>
        </div>
      </Modal>

      {/* ════ Client Profile Modal ════ */}
      <Modal isOpen={showClientProfileModal} onClose={() => setShowClientProfileModal(false)} title="Client Profile" size="md">
        <div className="bg-white">
          {/* Identity */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">{clientInfo?.name || 'Client'}</h3>
              {clientInfo?.verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
            </div>
            <p className="text-sm text-slate-500 mt-1">{clientInfo?.verified ? 'Verified Client' : 'Client'}</p>
          </div>

          {/* Contact */}
          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Contact Information</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm text-slate-900">{clientInfo?.email || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Phone</span>
                <span className="text-sm text-slate-900">{clientInfo?.phone || '—'}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Client Rating</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(clientInfo?.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-900 font-medium">{clientInfo?.rating || '0.0'}</span>
              <span className="text-sm text-slate-500">({clientInfo?.reviewCount || 0} reviews)</span>
            </div>
          </div>

          {/* Verification */}
          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Verification Status</p>
            <div className="flex items-center gap-2">
              {clientInfo?.verified ? (
                <>
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-900">Verified Client</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  </div>
                  <span className="text-sm text-slate-500">Not yet verified</span>
                </>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="py-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Platform Activity</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Gigs Posted</span>
              <span className="text-sm text-slate-900 font-medium">
                {gigs.filter(g => g.ownerId === clientInfo?.id).length} active gig{gigs.filter(g => g.ownerId === clientInfo?.id).length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowClientProfileModal(false)}
            className="w-full mt-1 px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
