import { useState } from 'react'
import { CheckCircle, Loader } from 'lucide-react'
import Modal from '../UI/Modal'
import Button from '../UI/Button'
import Card from '../UI/Card'

export default function PaymentModal({ isOpen, onClose, amount, gigTitle, studentName, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Process Payment">
      <div className="space-y-6">
        {!success && !processing && (
          <>
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ₱{amount?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Payment for: {gigTitle}
              </p>
              {studentName && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  To: {studentName}
                </p>
              )}
            </div>

            <Card>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₱{amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    GCash (Mock)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gig:</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right">
                    {gigTitle}
                  </span>
                </div>
              </div>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This is a mock payment for demonstration purposes.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleMockPayment}
                className="flex-1"
              >
                Pay Now
              </Button>
            </div>
          </>
        )}

        {processing && (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Processing Payment...
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we process your payment
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your payment of ₱{amount?.toLocaleString()} has been processed successfully.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}


