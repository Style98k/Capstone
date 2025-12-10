import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Lock, Mail, User, Phone, Eye, EyeOff } from 'lucide-react'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import { motion } from 'framer-motion'
import Card from '../../components/UI/Card'

export default function Register() {
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role') || 'student'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: roleParam
  })

  useEffect(() => {
    const role = searchParams.get('role') || 'student'
    setFormData(prev => ({ ...prev, role }))
  }, [searchParams])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...userData } = formData
      const result = await register(userData)

      if (result?.success) {
        const redirectPath = 
          formData.role === 'student' ? '/verify-student' :
          formData.role === 'client' ? '/client/dashboard' :
          '/'
        navigate(redirectPath)
      } else {
        setError(result?.message || 'Registration failed')
      }
    } catch (err) {
      setError('An error occurred during registration')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/40">
              <span className="text-white font-bold text-3xl">Q</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create your QuickGig account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Fill in your details to get started.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="mb-2">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">I want to...</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                    className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                      formData.role === 'student'
                        ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                        : 'border-gray-200 hover:border-sky-200 hover:bg-sky-50/40 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-sm ${
                          formData.role === 'student' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.16em]">Find gigs</span>
                    </div>
                    <p className="text-xs text-gray-600">Sign up as a student.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'client' }))}
                    className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                      formData.role === 'client'
                        ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                        : 'border-gray-200 hover:border-sky-200 hover:bg-sky-50/40 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-sm ${
                          formData.role === 'client' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.16em]">Hire students</span>
                    </div>
                    <p className="text-xs text-gray-600">Sign up as a client.</p>
                  </button>
                </div>
              </div>

              <Input
                label="Full Name"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                leftIcon={User}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                leftIcon={Mail}
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+63 912 345 6789"
                leftIcon={Phone}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                leftIcon={Lock}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                id="confirm-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                leftIcon={Lock}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <p className="text-xs text-gray-500">Password must be at least 6 characters.</p>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 border-0"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
