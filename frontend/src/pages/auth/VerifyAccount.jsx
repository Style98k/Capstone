import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyAccount() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying, success, error

  // Simulate verification
  const handleVerify = () => {
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center">
            {status === 'verifying' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Verify Your Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Click the button below to verify your email address
                </p>
                <Button onClick={handleVerify} className="w-full">
                  Verify Email
                </Button>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Account Verified!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your account has been successfully verified. Redirecting to login...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  The verification link is invalid or has expired.
                </p>
                <Button onClick={() => navigate('/login')} className="w-full">
                  Go to Login
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

