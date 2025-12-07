import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useLocalAuth'
import { mockGigs } from '../data/mockGigs'
import { mockApplications } from '../data/mockApplications'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import Textarea from '../components/UI/Textarea'
import GigCommentRating from '../components/Shared/GigCommentRating'
import { MapPin, Clock, DollarSign, User } from 'lucide-react'
import { useState } from 'react'

export default function GigDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [proposal, setProposal] = useState('')

  const gig = mockGigs.find(g => g.id === id)
  const hasApplied = user && mockApplications.some(
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
      // In real app, submit application
      console.log('Application submitted:', proposal)
      setShowApplyModal(false)
      setProposal('')
      alert('Application submitted successfully!')
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
                <DollarSign className="w-4 h-4" />
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
      >
        <div className="space-y-4">
          <Textarea
            label="Your Proposal"
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="Tell the client why you're a good fit for this job..."
            rows={6}
            required
          />
          <div className="flex gap-2">
            <Button onClick={handleApply} className="flex-1">
              Submit Application
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowApplyModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Gig Reviews & Ratings Section */}
      <GigCommentRating gigId={id} />
    </div>
  )
}

