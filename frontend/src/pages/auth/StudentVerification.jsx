import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle, X } from 'lucide-react'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import { motion } from 'framer-motion'

export default function StudentVerification() {
  const [formData, setFormData] = useState({
    studentId: '',
    assessmentFile: null
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        assessmentFile: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate student ID format (S-YYYY-XXX)
    const studentIdRegex = /^S-\d{4}-\d{3}$/
    if (!studentIdRegex.test(formData.studentId)) {
      setError('Please enter a valid student ID (e.g., S-2024-001)')
      return
    }

    if (!formData.assessmentFile) {
      setError('Please upload your assessment form')
      return
    }

    try {
      setIsSubmitting(true)
      // In a real app, you would upload the file to your server here
      // and update the user's verification status
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      // On success
      setIsSuccess(true)
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/student/dashboard')
      }, 2000)
    } catch (err) {
      setError('Verification failed. Please try again.')
      console.error('Verification error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="text-center p-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your documents have been submitted for review. We'll notify you once your account is verified.
            </p>
            <Button onClick={() => navigate('/student/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Student Verification</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your student verification to access all features
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-center">
              <X className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="S-2024-001"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Format: S-YYYY-XXX (e.g., S-2024-001)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assessment Form
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-sky-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-2 text-center">
                  <FileText className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <span className="relative cursor-pointer rounded-md font-medium text-sky-600 hover:text-sky-500">
                      Upload a file
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      required
                    />
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX up to 5MB
                  </p>
                </div>
              </div>
              {formData.assessmentFile && (
                <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {formData.assessmentFile.name}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
              
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="mt-3 w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                I'll do this later
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
