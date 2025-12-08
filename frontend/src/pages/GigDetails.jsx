import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useLocalAuth'
import { getGigs, getApplications, saveApplication, initializeLocalStorage } from '../utils/localStorage'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import Textarea from '../components/UI/Textarea'
import GigCommentRating from '../components/Shared/GigCommentRating'
import { MapPin, Clock, Coins, User, FileText, Sparkles } from 'lucide-react'
import { useState, useRef, useMemo } from 'react'

export default function GigDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showApplyModal, setShowApplyModal] = useState(false)
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
          type: f.type
        }))
      }
      
      const result = saveApplication(applicationData)
      
      if (result.success) {
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
                  ₱{gig.pay.toLocaleString()}
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

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 flex gap-4">
          {user && user.role === 'student' && !hasApplied && (
            <Button onClick={() => setShowApplyModal(true)}>Apply for this Gig</Button>
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
      </Card>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for Gig"
        size="lg"
      >
        <div className="space-y-6">
          {/* Header with gig info */}
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50/70 via-white to-white dark:from-primary-900/20 dark:via-gray-900/40 px-4 py-3 sm:px-5 sm:py-4 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300 mb-1">
                Application
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {gig.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{gig.company || 'Client'}</span>
              </p>
            </div>
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 shadow-inner border border-primary-100/60 dark:border-primary-800/60">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* Info strip / upload area */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-start gap-3 rounded-xl border border-primary-100 dark:border-primary-900/40 bg-primary-50/70 dark:bg-primary-900/20 px-4 py-3 text-left hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors"
          >
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-sm">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-300" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">
                Attach your resume, portfolio, or any supporting files
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                Optional, but highly recommended – upload PDFs, images, or documents to showcase your work.
              </p>
            </div>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*,.txt,.zip"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (files.length === 0) return

              setAttachments(prev => {
                const existingKeys = new Set(
                  prev.map(f => `${f.name}-${f.size}-${f.lastModified}`)
                )
                const toAdd = files.filter(
                  f => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`)
                )
                return [...prev, ...toAdd]
              })

              setIsManagingAttachments(false)
              setAttachmentsToRemove([])

              // reset input so selecting the same file again still triggers onChange
              e.target.value = ''
            }}
          />

          {attachments.length > 0 && (
            <div className="rounded-xl border border-dashed border-primary-200 dark:border-primary-800 bg-white/60 dark:bg-gray-900/40 px-4 py-3 text-xs text-gray-600 dark:text-gray-300 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-900 dark:text-white">Selected files ({attachments.length}):</p>
                {!isManagingAttachments ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsManagingAttachments(true)
                      setAttachmentsToRemove([])
                    }}
                    className="text-[11px] font-medium text-primary-600 dark:text-primary-300 hover:underline"
                  >
                    Manage
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
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
                      className="text-[11px] font-medium text-red-600 dark:text-red-400 hover:underline"
                    >
                      Remove selected
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsManagingAttachments(false)
                        setAttachmentsToRemove([])
                      }}
                      className="text-[11px] text-gray-500 hover:underline"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <ul className="space-y-0.5 mt-1">
                {attachments.map((file, idx) => {
                  const checked = attachmentsToRemove.includes(idx)
                  return (
                    <li
                      key={idx}
                      className="flex items-center gap-2 truncate rounded-md px-2 py-1 hover:bg-primary-50/80 dark:hover:bg-primary-900/40 transition-colors"
                    >
                      {isManagingAttachments && (
                        <input
                          type="checkbox"
                          className="h-3 w-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
                      <FileText className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                      <span className="truncate text-[11px] sm:text-xs text-gray-800 dark:text-gray-100">{file.name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Proposal field */}
          <div className="mt-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 px-4 py-3 sm:px-5 sm:py-4 shadow-sm hover:shadow-md focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-200 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-800 transition-all">
            <Textarea
              label="Your Proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Tell the client why you're a great fit, your experience, and when you can start..."
              rows={7}
              required
              className="mt-1 border-0 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 shadow-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowApplyModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="w-full sm:flex-1 shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40"
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>

      {/* Gig Reviews & Ratings Section */}
      <GigCommentRating gigId={id} />
    </div>
  )
}

