import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { triggerNotification } from '../../utils/notificationManager'
import { getTransactions, saveTransaction, getGigs, getApplications } from '../../utils/localStorage'
import { mockUsers } from '../../data/mockUsers'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import PaymentModal from '../../components/Shared/PaymentModal'
import { Coins, Clock, CheckCircle, CreditCard, Smartphone } from 'lucide-react'

export default function Payments() {
  const { user } = useAuth()
  const [paymentModal, setPaymentModal] = useState(null)
  const [allTransactions, setAllTransactions] = useState([])
  const [allGigs, setAllGigs] = useState([])
  const [allApplications, setAllApplications] = useState([])

  // Load data from localStorage and update periodically
  useEffect(() => {
    const updateData = () => {
      setAllTransactions(getTransactions())
      setAllGigs(getGigs())
      setAllApplications(getApplications())
    }

    updateData()

    window.addEventListener('storage', updateData)
    const interval = setInterval(updateData, 2000)

    return () => {
      window.removeEventListener('storage', updateData)
      clearInterval(interval)
    }
  }, [])

  // Get all users from localStorage and mockUsers
  const getAllUsers = () => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
      const additionalUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')
      const allUsers = [...mockUsers]
      const seenEmails = new Set(mockUsers.map(u => u.email))
      for (const u of [...registeredUsers, ...additionalUsers]) {
        if (!seenEmails.has(u.email)) {
          allUsers.push(u)
          seenEmails.add(u.email)
        }
      }
      return allUsers
    } catch {
      return mockUsers
    }
  }

  const allUsers = getAllUsers()

  // Get all transactions where user is the payer
  const myPayments = allTransactions
    .filter(t => t.fromUserId === user?.id)
    .map(trans => ({
      ...trans,
      gig: allGigs.find(g => g.id === trans.gigId),
      student: allUsers.find(u => u.id === trans.toUserId),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Get completed gigs that need payment
  const completedGigs = allApplications
    .filter(app => {
      const gig = allGigs.find(g => g.id === app.gigId)
      return gig?.ownerId === user?.id && app.status === 'completed'
    })
    .map(app => ({
      ...app,
      gig: allGigs.find(g => g.id === app.gigId),
      student: allUsers.find(u => u.id === app.userId),
    }))
    .filter(app => {
      // Only show if payment hasn't been made yet
      return !allTransactions.some(
        t => t.gigId === app.gigId && t.fromUserId === user?.id && t.status === 'completed'
      )
    })

  const totalPaid = myPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = myPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  const handlePaymentSuccess = (paymentData) => {
    // Save transaction to localStorage
    const transactionData = {
      gigId: paymentModal.gigId,
      fromUserId: user?.id,
      toUserId: paymentModal.studentId,
      amount: paymentModal.amount,
      paymentMethod: paymentData.paymentMethod || 'GCash'
    }

    const result = saveTransaction(transactionData)

    if (result.success) {
      // Trigger notification to student
      triggerNotification('student', 'Payment Received', `You received ₱${paymentModal.amount.toLocaleString()} for "${paymentModal.gigTitle}"!`, 'payment')

      alert('Payment processed successfully!')
      setPaymentModal(null)
    } else {
      alert('Payment failed. Please try again.')
    }
  }

  const handleMakePayment = (gig, student) => {
    setPaymentModal({
      amount: gig.pay,
      gigTitle: gig.title,
      studentName: student?.name,
      gigId: gig.id,
      studentId: student?.id,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your payments and transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₱{totalPaid.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₱{pendingPayments.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {myPayments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Payments - Completed Gigs */}
      {completedGigs.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Payments
            </h2>
          </div>
          <div className="space-y-4">
            {completedGigs.map((app) => (
              <div
                key={app.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {app.gig?.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Student: {app.student?.name}
                  </p>
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
                    ₱{app.gig?.pay.toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleMakePayment(app.gig, app.student)}
                  className="ml-4"
                >
                  Pay Now
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Payment History
        </h2>
        {myPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Gig
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {myPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {payment.gig?.title || 'Unknown'}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {payment.student?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        ₱{payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        {payment.paymentMethod === 'GCash' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        <span>{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${payment.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Coins className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              No payment history yet
            </p>
          </div>
        )}
      </Card>

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


