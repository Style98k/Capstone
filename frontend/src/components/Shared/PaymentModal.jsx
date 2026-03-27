import { useState, useEffect } from 'react'
import { calculateFee } from '../../utils/feeCalculator'
import { saveRating } from '../../utils/ratingUtils'
import { CheckCircle, Loader, Info, Wallet, ArrowRight, ArrowLeft, Star, Send, Smartphone, CreditCard, MoreHorizontal } from 'lucide-react'
import { SiPaypal, SiGrab, SiShopee } from 'react-icons/si'
import Modal from '../UI/Modal'

// E-Wallet options with brand colors
const EWALLET_OPTIONS = [
  {
    name: 'GCash',
    icon: Smartphone,
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    hoverBorder: 'hover:border-blue-500',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-700 dark:text-blue-300',
    accentGradient: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Maya',
    icon: CreditCard,
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    hoverBorder: 'hover:border-green-500',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-700 dark:text-green-300',
    accentGradient: 'from-green-500 to-green-600',
  },
  {
    name: 'GrabPay',
    icon: SiGrab,
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    hoverBorder: 'hover:border-emerald-500',
    hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    accentGradient: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'ShopeePay',
    icon: SiShopee,
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    hoverBorder: 'hover:border-orange-500',
    hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    textColor: 'text-orange-700 dark:text-orange-300',
    accentGradient: 'from-orange-500 to-orange-600',
  },
  {
    name: 'PayPal',
    icon: SiPaypal,
    borderColor: 'border-[#003087]',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    hoverBorder: 'hover:border-[#003087]',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
    iconColor: 'text-[#003087] dark:text-[#009cde]',
    textColor: 'text-[#003087] dark:text-[#009cde]',
    accentGradient: 'from-[#003087] to-[#009cde]',
  },
  {
    name: 'Others',
    icon: MoreHorizontal,
    borderColor: 'border-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    hoverBorder: 'hover:border-gray-500',
    hoverBg: 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
    iconColor: 'text-gray-600 dark:text-gray-400',
    textColor: 'text-gray-700 dark:text-gray-300',
    accentGradient: 'from-gray-500 to-gray-600',
  },
]

export default function PaymentModal({ isOpen, onClose, amount, gigTitle, studentName, studentId, gigId, currentUser, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fee, setFee] = useState(0)
  const [total, setTotal] = useState(0)

  // Multi-step state: 1 = E-Wallet Selection, 2 = Payment Summary, 3 = Rating
  const [step, setStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState(null)

  // Rating step state
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    if (amount) {
      const calculatedFee = calculateFee(amount)
      setFee(calculatedFee)
      setTotal(amount + calculatedFee)
    }
  }, [amount])

  const handleSelectMethod = (methodName) => {
    setSelectedMethod(methodName)
    setStep(2)
  }

  const handleMockPayment = async () => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)

      // Call success callback after showing success, then transition to rating step
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            paymentMethod: selectedMethod || 'GCash',
            amount,
            fee,
            total
          })
        }
        // Transition to rating step instead of closing
        setSuccess(false)
        setStep(3)
      }, 1500)
    }, 1500)
  }

  const handleSubmitRating = async () => {
    setSubmittingRating(true)

    // Save the rating
    await saveRating({
      raterId: currentUser?.id,
      raterName: currentUser?.name,
      raterRole: 'client',
      targetId: studentId,
      gigId: gigId,
      gigTitle: gigTitle,
      rating,
      comment
    })

    // Short delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmittingRating(false)
    handleClose()
  }

  const handleSkipRating = () => {
    handleClose()
  }

  const handleClose = () => {
    setProcessing(false)
    setSuccess(false)
    setStep(1)
    setSelectedMethod(null)
    setRating(5)
    setComment('')
    setHoveredStar(0)
    onClose()
  }

  // Determine Tier Badge based on amount
  const getTierInfo = () => {
    if (amount < 1000) return { label: 'Small Gig', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' }
    if (amount < 5000) return { label: 'Standard Gig', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' }
    return { label: 'Premium Gig', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }
  }

  const tier = getTierInfo()

  // Get the selected method config for display
  const selectedMethodConfig = EWALLET_OPTIONS.find(opt => opt.name === selectedMethod)

  // Determine modal title
  const getModalTitle = () => {
    if (step === 1) return 'Select Payment Method'
    if (step === 2) return 'Payment Summary'
    if (step === 3) return 'Rate Your Experience'
    return 'Payment'
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getModalTitle()}>
      <div className="space-y-6">

        {/* ─── Step 1: E-Wallet Selection ─── */}
        {step === 1 && !processing && !success && (
          <>
            {/* Header */}
            <div className="text-center mb-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Choose Your E-Wallet
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a payment method to continue
              </p>
            </div>

            {/* E-Wallet Grid (2 columns) */}
            <div className="grid grid-cols-2 gap-3">
              {EWALLET_OPTIONS.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.name}
                    onClick={() => handleSelectMethod(option.name)}
                    className={`
                      group relative flex flex-col items-center gap-3 p-5 rounded-xl
                      border-2 border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800
                      ${option.hoverBorder} ${option.hoverBg}
                      transition-all duration-200 ease-in-out
                      hover:-translate-y-0.5 hover:shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    `}
                  >
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      bg-gray-100 dark:bg-gray-700
                      group-hover:bg-gradient-to-br group-hover:${option.accentGradient}
                      transition-all duration-200
                    `}>
                      <IconComponent className={`w-6 h-6 ${option.iconColor} group-hover:text-white transition-colors duration-200`} />
                    </div>
                    <span className={`text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:${option.textColor} transition-colors duration-200`}>
                      {option.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Cancel */}
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* ─── Step 2: Payment Summary ─── */}
        {step === 2 && !success && !processing && (
          <>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Payment Summary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review the payment details before confirming.
              </p>
            </div>

            {/* Job Details Card */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Title</p>
                <p className="font-bold text-gray-900 dark:text-white">{gigTitle}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Paying To</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">{studentName}</p>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white font-medium">Student Receives</span>
                <span className="font-semibold text-gray-900 dark:text-white">₱{amount?.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-white font-medium">Service Fee</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${tier.color}`}>
                    {tier.label}
                  </span>
                </div>
                <span className="font-semibold text-emerald-600">+₱{fee?.toLocaleString()}</span>
              </div>

              {/* Selected Payment Method Row */}
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white font-medium">Payment Method</span>
                <div className="flex items-center gap-2">
                  {selectedMethodConfig && (
                    <selectedMethodConfig.icon className={`w-4 h-4 ${selectedMethodConfig.iconColor}`} />
                  )}
                  <span className={`font-semibold ${selectedMethodConfig?.textColor || 'text-gray-700 dark:text-gray-300'}`}>
                    {selectedMethod}
                  </span>
                  <span className="text-xs text-gray-400">(Mock Integration)</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">TOTAL TO PAY</span>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">₱{total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                A service fee is added to the total amount. This ensures the student receives their full asking price while supporting the platform.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="grid grid-cols-[auto_1fr_1fr] gap-3 pt-2">
              {/* Change Method Button */}
              <button
                onClick={() => setStep(1)}
                className="px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Change
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMockPayment}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Confirm Payment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ─── Processing State ─── */}
        {processing && (
          <div className="text-center space-y-6 py-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-900/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Processing via {selectedMethod}...
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Securely transferring ₱{total?.toLocaleString()} to {studentName}
              </p>
            </div>
          </div>
        )}

        {/* ─── Success State (brief display before rating step) ─── */}
        {success && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You have successfully paid <span className="font-bold text-gray-900 dark:text-white">₱{total?.toLocaleString()}</span> via {selectedMethod}
              </p>
            </div>
          </div>
        )}

        {/* ─── Step 3: Rate Student ─── */}
        {step === 3 && !processing && !success && (
          <div className="space-y-6">
            {/* Success confirmation */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Payment Complete!
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How was your experience working with <span className="font-semibold text-gray-700 dark:text-gray-200">{studentName}</span>?
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tap to rate</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Leave a comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this student..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleSkipRating}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingRating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
