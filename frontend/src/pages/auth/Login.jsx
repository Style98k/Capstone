import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useLocalAuth'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    
    if (result.success) {
      const redirectPath = 
        result.user.role === 'student' ? '/student/dashboard' :
        result.user.role === 'client' ? '/client/dashboard' :
        result.user.role === 'admin' ? '/admin/dashboard' : '/'
      navigate(redirectPath)
    } else {
      setError(result.message || 'Invalid credentials')
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account to continue.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Email or School ID"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or school ID"
              required
              leftIcon={Mail}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 border-0"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-600 hover:text-sky-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
        </motion.div>
      </div>
    </div>
  )
}

