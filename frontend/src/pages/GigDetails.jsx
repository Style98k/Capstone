import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useLocalAuth'
import { getGigs, getApplications, saveApplication, initializeLocalStorage } from '../utils/localStorage'
import { triggerNotification } from '../utils/notificationManager'
import { getUserRating } from '../utils/ratingUtils'
import { mockUsers } from '../data/mockUsers'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import GigCommentRating from '../components/Shared/GigCommentRating'
import { MapPin, Clock, Coins, User, FileText, AlertTriangle, Upload, BadgeCheck, Star, ExternalLink } from 'lucide-react'
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

  // Get gigs and applications from localStorage
  const gigs = useMemo(() => {
    initializeLocalStorage()
    return getGigs()
  }, [])

  const applications = useMemo(() => {
    return getApplications()
  }, [])

  const gig = gigs.find(g => g.id === id)
  const hasApplied = user && applications.some(
    app => app.gigId === id && app.userId === user.id
  )

  // Get client info for the gig owner
  const clientInfo = useMemo(() => {
    if (!gig?.ownerId) return null

    // Check localStorage users first
    const storedUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
    const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
    const allUsers = [...mockUsers, ...storedUsers, ...registeredUsers]

    // Find client by ownerId
    const client = allUsers.find(u => u.id === gig.ownerId)
    if (!client) return null

    // Get client rating
    const ratingData = getUserRating(gig.ownerId)

    return {
      id: client.id,
      name: client.name || 'Unknown Client',
      email: client.email,
      phone: client.phoneNumber || client.phone || null,
      verified: client.verified === true || client.verified === 'verified',
      rating: ratingData.average || 0,
      reviewCount: ratingData.count || 0
    }
  }, [gig])

  if (!gig) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Gig not found</p>
        <Link to="/gigs">
          <Button className="mt-4">Back to Gigs</Button>
        </Link>
      </div>
    )
  }

  const handleApply = () => {
    if (proposal.trim()) {
      // Save application to localStorage
      const applicationData = {
        gigId: id,
        userId: user.id,
        proposal: proposal,
        attachments: attachments.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          data: f.data // Include base64 data
        }))
      }

      const result = saveApplication(applicationData)

      if (result.success) {
        // Trigger notification to client (gig owner)
        triggerNotification('client', 'New Applicant! 📩', `A student applied for "${gig.title}". Review their application now.`, 'application');

        setShowApplyModal(false)
        setProposal('')
        setAttachments([])
        alert('Application submitted successfully!')
        // You could navigate or refresh the page here
        window.location.reload()
      } else {
        alert('Failed to submit application. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {gig.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{gig.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{gig.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  ₱{(gig.pay || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
              {gig.category}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Description
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {gig.fullDesc || gig.shortDesc}
          </p>
        </div>

        {gig.imageUrl && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Reference Image
            </h2>
            <img
              src={gig.imageUrl}
              alt="Reference for this gig"
              className="w-full max-h-64 object-cover rounded-lg mt-4 mb-4 shadow-sm border border-gray-200 dark:border-neutral-800"
            />
          </div>
        )}

        {gig.requirements && gig.requirements.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              {Array.isArray(gig.requirements) ? (
                gig.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))
              ) : (
                <li>{gig.requirements}</li>
              )}
            </ul>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 flex flex-col gap-4">
          {/* Verification Warning for Students */}
          {user && user.role === 'student' && !(user.verified === true || user.verified === 'verified') && !hasApplied && (
            <div className="bg-gradient-to-r from-amber-50 to-red-50 dark:from-amber-900/30 dark:to-red-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Verification Required</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You must verify your account before applying for gigs. Please upload your School ID and NBI Clearance in your profile.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {user && user.role === 'student' && !hasApplied && (
              (user.verified === true || user.verified === 'verified') ? (
                <Button onClick={() => setShowApplyModal(true)}>Apply for this Gig</Button>
              ) : (
                <Button
                  disabled
                  className="bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                >
                  Verify Account to Apply
                </Button>
              )
            )}
            {hasApplied && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-700 dark:text-green-300">
                  You have already applied for this gig
                </p>
              </div>
            )}
            {!user && (
              <Link to="/login">
                <Button>Login to Apply</Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </div>
      </Card>

      {/* Apply Modal - Minimalist SaaS Design */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for Gig"
        size="lg"
      >
        <div className="space-y-5 bg-white">
          {/* Client Spotlight Header */}
          <div className="border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Client
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">
                      {clientInfo?.name || gig.company || 'Client'}
                    </span>
                    {clientInfo?.verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    {clientInfo?.rating > 0 ? (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {clientInfo.rating} ({clientInfo.reviewCount} reviews)
                      </span>
                    ) : (
                      <span>No ratings yet</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowClientProfileModal(true)
                }}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Job Title */}
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              Applying For
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {gig.title}
            </h3>
          </div>

          {/* Attachment Upload Area - Minimalist Design */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Attachments (Optional)
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-dashed border-2 border-slate-200 rounded-lg p-6 text-center hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">
                Click to upload files
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PDF, DOC, images, or portfolio links
              </p>
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
                    if (prev.some(f => `${f.name}-${f.size}` === key)) {
                      return prev
                    }
                    return [...prev, {
                      name: file.name,
                      size: Math.round(file.size / 1024),
                      type: file.type,
                      data: event.target.result
                    }]
                  })
                }
                reader.readAsDataURL(file)
              })

              setIsManagingAttachments(false)
              setAttachmentsToRemove([])
              e.target.value = ''
            }}
          />

          {/* Selected Files List */}
          {attachments.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-700">
                  {attachments.length} file{attachments.length > 1 ? 's' : ''} selected
                </p>
                {!isManagingAttachments ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsManagingAttachments(true)
                      setAttachmentsToRemove([])
                    }}
                    className="text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    Manage
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (attachmentsToRemove.length === 0) {
                          setIsManagingAttachments(false)
                          return
                        }
                        setAttachments(prev => prev.filter((_, idx) => !attachmentsToRemove.includes(idx)))
                        setAttachmentsToRemove([])
                        setIsManagingAttachments(false)
                      }}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsManagingAttachments(false)
                        setAttachmentsToRemove([])
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <ul className="space-y-1">
                {attachments.map((file, idx) => {
                  const checked = attachmentsToRemove.includes(idx)
                  return (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-slate-600 py-1 px-2 rounded hover:bg-slate-50"
                    >
                      {isManagingAttachments && (
                        <input
                          type="checkbox"
                          name={`remove-attachment-${idx}`}
                          id={`remove-attachment-${idx}`}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                          checked={checked}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            setAttachmentsToRemove(prev => {
                              if (isChecked) {
                                return [...prev, idx]
                              }
                              return prev.filter(id => id !== idx)
                            })
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

          {/* Proposal Textarea - Clean Design */}
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
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all resize-none"
            />
          </div>

          {/* Applying As Badge - Auto-filled from logged-in user */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500">
              Applying as: <span className="font-medium text-slate-700">{user?.name}</span> ({user?.email})
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
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
              className="w-full sm:flex-1 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Application
            </button>
          </div>
        </div>
      </Modal>

      {/* Client Profile Modal - Minimalist Design */}
      <Modal
        isOpen={showClientProfileModal}
        onClose={() => setShowClientProfileModal(false)}
        title="Client Profile"
        size="md"
      >
        <div className="bg-white">
          {/* 1. Identity Header - Centered */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-slate-500" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">
                {clientInfo?.name || 'Client'}
              </h3>
              {clientInfo?.verified && (
                <BadgeCheck className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {clientInfo?.verified ? 'Verified Client' : 'Client'}
            </p>
          </div>

          {/* 2. Contact Information Section */}
          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              Contact Information
            </p>
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

          {/* 3. Client Rating Section */}
          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              Client Rating
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(clientInfo?.rating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-900 font-medium">
                {clientInfo?.rating || '0.0'}
              </span>
              <span className="text-sm text-slate-500">
                ({clientInfo?.reviewCount || 0} reviews)
              </span>
            </div>
          </div>

          {/* 4. Verification Details Section */}
          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              Verification Status
            </p>
            <div className="flex items-center gap-2">
              {clientInfo?.verified ? (
                <>
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-slate-900">Verified Client</span>
                    
                  </div>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  </div>
                  <span className="text-sm text-slate-500">Not yet verified</span>
                </>
              )}
            </div>
          </div>

          {/* 5. Platform Activity Section */}
          <div className="py-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              Platform Activity
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Gigs Posted</span>
              <span className="text-sm text-slate-900 font-medium">
                {gigs.filter(g => g.ownerId === clientInfo?.id).length} active gig{gigs.filter(g => g.ownerId === clientInfo?.id).length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setShowClientProfileModal(false)}
            className="w-full mt-2 px-6 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Gig Reviews & Ratings Section */}
      <GigCommentRating gigId={id} />
    </div>
  )
}

