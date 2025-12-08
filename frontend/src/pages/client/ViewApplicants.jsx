import { useState, useMemo } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { getApplications, getGigs, updateApplication, updateGig, getApplicationsForClient, initializeLocalStorage } from '../../utils/localStorage'
import { mockUsers } from '../../data/mockUsers'
import { mockTransactions } from '../../data/mockTransactions'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import UserCard from '../../components/Shared/UserCard'
import Modal from '../../components/UI/Modal'
import PaymentModal from '../../components/Shared/PaymentModal'
import { Check, X, Star, Coins } from 'lucide-react'

export default function ViewApplicants() {
  const { user } = useAuth()
  const [selectedGig, setSelectedGig] = useState('')
  const [ratingModal, setRatingModal] = useState(null)
  const [paymentModal, setPaymentModal] = useState(null)
  
  // Get data from localStorage
  const gigs = useMemo(() => {
    initializeLocalStorage()
    return getGigs()
  }, [])
  
  const applications = useMemo(() => {
    return getApplications()
  }, [])
  
  const myGigs = gigs.filter(g => g.ownerId === user?.id)
  const selectedGigId = selectedGig || myGigs[0]?.id
  
  const applicants = applications
    .filter(app => app.gigId === selectedGigId)
    .map(app => ({
      ...app,
      user: mockUsers.find(u => u.id === app.userId),
      gig: gigs.find(g => g.id === app.gigId),
    }))

  const handleApprove = (appId) => {
    // Update application status to hired
    const result = updateApplication(appId, { status: 'hired' })
    
    if (result.success) {
      // Update gig status to hired
      const application = applications.find(app => app.id === appId)
      if (application) {
        updateGig(application.gigId, { status: 'hired' })
      }
      alert('Application approved! Student has been hired.')
      window.location.reload()
    } else {
      alert('Failed to approve application. Please try again.')
    }
  }

  const handleReject = (appId) => {
    // Update application status to rejected
    const result = updateApplication(appId, { status: 'rejected' })
    
    if (result.success) {
      alert('Application rejected.')
      window.location.reload()
    } else {
      alert('Failed to reject application. Please try again.')
    }
  }

  const handleMakePayment = (app) => {
    setPaymentModal({
      amount: app.gig?.pay,
      gigTitle: app.gig?.title,
      studentName: app.user?.name,
      gigId: app.gigId,
      studentId: app.userId,
    })
  }

  const handlePaymentSuccess = (paymentData) => {
    // In real app, this would create a transaction record
    console.log('Payment successful:', paymentData)
    alert('Payment processed successfully!')
    setPaymentModal(null)
  }

  const hasPaymentBeenMade = (gigId) => {
    return mockTransactions.some(
      t => t.gigId === gigId && t.fromUserId === user?.id && t.status === 'completed'
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">View Applicants</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and manage applications for your job posts
        </p>
      </div>

      <Card>
        <div className="mb-4">
          <label className="label">Select Job</label>
          <select
            value={selectedGig}
            onChange={(e) => setSelectedGig(e.target.value)}
            className="input"
          >
            {myGigs.map((gig) => (
              <option key={gig.id} value={gig.id}>
                {gig.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {applicants.length > 0 ? (
          applicants.map((app) => (
            <Card key={app.id} hover>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <UserCard user={app.user} />
                  
                  {app.proposal && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Proposal:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app.proposal}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        app.status === 'hired'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : app.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {app.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleApprove(app.id)}
                        className="flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Hire
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(app.id)}
                        className="flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  {app.status === 'completed' && (
                    <>
                      {!hasPaymentBeenMade(app.gigId) && (
                        <Button
                          onClick={() => handleMakePayment(app)}
                          className="flex items-center justify-center gap-2"
                        >
                          <Coins className="w-4 h-4" />
                          Pay Now
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setRatingModal(app)}
                        className="flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Rate Student
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No applicants for this job yet
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <Modal
          isOpen={!!ratingModal}
          onClose={() => setRatingModal(null)}
          title="Rate Student"
        >
          <RatingForm
            application={ratingModal}
            onClose={() => setRatingModal(null)}
          />
        </Modal>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <PaymentModal
          isOpen={!!paymentModal}
          onClose={() => setPaymentModal(null)}
          amount={paymentModal.amount}
          gigTitle={paymentModal.gigTitle}
          studentName={paymentModal.studentName}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

function RatingForm({ application, onClose }) {
  const [stars, setStars] = useState(5)
  const [review, setReview] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // In real app, submit rating
    console.log('Rating submitted:', { stars, review })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStars(star)}
              className={`text-3xl ${
                star <= stars
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Review (Optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="input"
          rows={4}
          placeholder="Write a review..."
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Submit Rating</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

