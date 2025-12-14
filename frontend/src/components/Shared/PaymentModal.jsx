import { useState, useEffect } from 'react'
import { calculateFee } from '../../utils/feeCalculator'
import { CheckCircle, Loader, CreditCard, Info, Wallet, ArrowRight } from 'lucide-react'
import Modal from '../UI/Modal'
import Button from '../UI/Button'
import Card from '../UI/Card'

export default function PaymentModal({ isOpen, onClose, amount, gigTitle, studentName, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fee, setFee] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (amount) {
      const calculatedFee = calculateFee(amount)
      setFee(calculatedFee)
      setTotal(amount + calculatedFee)
    }
  }, [amount])

  const handleMockPayment = async () => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)

      // Call success callback after showing success
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            paymentMethod: 'GCash',
            amount,
            fee,
            total
          })
        }
        handleClose()
      }, 2000)
    }, 1500)
  }

  const handleClose = () => {
    setProcessing(false)
    setSuccess(false)
    onClose()
  }

  // Determine Tier Badge based on amount
  const getTierInfo = () => {
    if (amount < 1000) return { label: 'Small Gig', color: 'bg-blue-100 text-blue-700' }
    if (amount < 5000) return { label: 'Standard Gig', color: 'bg-indigo-100 text-indigo-700' }
    return { label: 'Premium Gig', color: 'bg-purple-100 text-purple-700' }
  }

  const tier = getTierInfo()

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Payment Summary">
      <div className="space-y-6">
        {!success && !processing && (
          <>
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-emerald-600" />
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
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
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

        {processing && (
          <div className="text-center space-y-6 py-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Processing Payment...
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Securely transferring ₱{total?.toLocaleString()} to {studentName}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You have successfully paid <span className="font-bold text-gray-900 dark:text-white">₱{total?.toLocaleString()}</span>
              </p>
            </div>
            <button
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
