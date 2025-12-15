import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useLocalAuth'
import { initializeLocalStorage, getOpenGigs, getGigs } from '../utils/localStorage'
import { mockUsers } from '../data/mockUsers'
import GigCard from '../components/Shared/GigCard'
import Button from '../components/UI/Button'
import { Briefcase, Users, Shield, TrendingUp, CheckCircle, GraduationCap, Star } from 'lucide-react'

// Helper to get all users (mock + registered from both storage keys)
const getAllUsers = () => {
  try {
    // Read from both quickgig_registered_users_v2 and quickgig_users_v2 for compatibility
    const registeredUsers = JSON.parse(localStorage.getItem('quickgig_registered_users_v2') || '[]')
    const additionalUsers = JSON.parse(localStorage.getItem('quickgig_users_v2') || '[]')

    // Merge all users, avoiding duplicates by email
    const allUsers = [...mockUsers]
    const seenEmails = new Set(mockUsers.map(u => u.email))

    for (const user of [...registeredUsers, ...additionalUsers]) {
      if (!seenEmails.has(user.email)) {
        allUsers.push(user)
        seenEmails.add(user.email)
      }
    }

    return allUsers
  } catch (error) {
    console.error('Error reading users:', error)
    return mockUsers
  }
}

// Helper to get statistics
const getStatistics = () => {
  const allUsers = getAllUsers()
  const gigs = getGigs()

  const activeStudents = allUsers.filter(user => user.role === 'student').length
  const registeredClients = allUsers.filter(user => user.role === 'client').length
  const activeGigs = gigs.filter(gig => gig.status === 'open').length

  return {
    activeStudents: activeStudents > 0 ? activeStudents : '10+',
    registeredClients: registeredClients,
    activeGigs: activeGigs
  }
}

export default function Home() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ activeStudents: '10+', registeredClients: '5+', activeGigs: 0 })
  const [recentGigs, setRecentGigs] = useState([])

  // Initialize and get recent gigs
  useEffect(() => {
    initializeLocalStorage()
    setRecentGigs(getOpenGigs().slice(0, 6))
  }, [])

  // Update statistics and recent gigs when component mounts or when localStorage changes
  useEffect(() => {
    const updateData = () => {
      const newStats = getStatistics()
      setStats(newStats)
      // Also update recent gigs for immediate display of new jobs
      setRecentGigs(getOpenGigs().slice(0, 6))
    }

    updateData()

    // Listen for storage changes to update stats and gigs in real-time
    const handleStorageChange = () => {
      updateData()
    }

    window.addEventListener('storage', handleStorageChange)

    // Also update periodically for same-tab changes
    const interval = setInterval(updateData, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-24 pt-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-2xl px-6 sm:px-10 lg:px-14 py-14 lg:py-18">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -left-10 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-fuchsia-400/30 blur-3xl" />

          <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
            {/* Hero copy */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Built for students & local clients
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="block">Find your</span>
                <span className="block bg-gradient-to-r from-amber-200 via-white to-emerald-200 bg-clip-text text-transparent">
                  Perfect Gig
                </span>
              </h1>

              <p className="max-w-xl mx-auto text-base sm:text-lg text-sky-50/90">
                Connect students with short-term freelance opportunities flexible, verified, and right in your community.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {!user && (
                  <>
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="rounded-full bg-white text-sky-700 hover:bg-slate-100 shadow-lg shadow-sky-900/20 px-7"
                      >
                        Get Started Free
                      </Button>
                    </Link>
                    <Link to="/gigs">
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full border-white/70 bg-white/10 text-white hover:bg-white/20 backdrop-blur px-7"
                      >
                        Browse Gigs
                      </Button>
                    </Link>
                  </>
                )}

                {user && (
                  <div className="space-y-4">
                    <p className="max-w-lg mx-auto text-sky-50/90">
                      Welcome back, <span className="font-semibold">{user.name}</span>! Continue managing your
                      {" "}
                      {user.role === 'student'
                        ? 'applications and earnings.'
                        : user.role === 'client'
                          ? 'job posts and applicants.'
                          : 'platform.'}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link
                        to={
                          user.role === 'student'
                            ? '/student/dashboard'
                            : user.role === 'client'
                              ? '/client/dashboard'
                              : '/admin/dashboard'
                        }
                      >
                        <Button
                          size="lg"
                          className="rounded-full bg-white text-sky-700 hover:bg-slate-100 shadow-lg shadow-sky-900/20 px-7"
                        >
                          Go to Dashboard
                        </Button>
                      </Link>
                      <Link to="/gigs">
                        <Button
                          variant="outline"
                          size="lg"
                          className="rounded-full border-white/70 bg-white/10 text-white hover:bg-white/20 backdrop-blur px-7"
                        >
                          Browse Gigs
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-sky-50/80 pt-2 justify-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verified students only
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Built for flexible, short-term gigs
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Banner */}
        <section className="-mt-6 w-full">
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-lg border border-sky-100/80 dark:border-slate-700 px-6 sm:px-10 py-6 sm:py-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Active Students
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{stats.activeStudents}</div>
              </div>
              <div className="transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Briefcase className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Registered Clients
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{stats.registeredClients}</div>
              </div>
              <div className="transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Active Gigs
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{stats.activeGigs}</div>
              </div>
            </div>
          </div>
        </section>

        {/* What is QuickGig Section */}
        <section className="bg-sky-50/80 dark:bg-slate-900/70 py-16 rounded-3xl w-full border border-sky-100/80 dark:border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              What is QuickGig?
            </h2>
            <p className="inline-flex items-center justify-center gap-2 rounded-full bg-white/70 dark:bg-slate-800/80 px-4 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-[0.18em]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Student-first gig marketplace
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
              QuickGig bridges the gap between students seeking flexible work and clients who need reliable, affordable services.
              Whether you want to earn around your class schedule or get trusted help fast, we make it simple to connect.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
              Every student is verified through school ID and Assesment form, and payments are handled securely with transparent ratings so both sides can
              focus on great work, not logistics.
            </p>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="w-full">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Popular Categories
          </h2>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-10">
            Discover the most in-demand ways students are helping local clients.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Tutoring', color: 'from-sky-400 to-indigo-500' },
              { label: 'Household', color: 'from-emerald-400 to-teal-500' },
              { label: 'Administrative', color: 'from-violet-400 to-fuchsia-500' },
              { label: 'Delivery', color: 'from-amber-400 to-orange-500' },
              { label: 'Event Help', color: 'from-pink-400 to-rose-500' },
              { label: 'Tech Support', color: 'from-cyan-400 to-sky-500' },
              { label: 'Data Entry', color: 'from-indigo-400 to-purple-500' },
              { label: 'Photography', color: 'from-rose-400 to-amber-500' },
            ].map((category) => (
              <Link
                key={category.label}
                to="/gigs"
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-4 sm:py-5 flex flex-col items-start justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div
                  className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white text-lg shadow-md shadow-slate-900/20 group-hover:scale-110 transition-transform`}
                >
                  <span>★</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">
                  {category.label}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Tap to explore gigs in this category.
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400">
                  <span>Browse gigs</span>
                  <span className="translate-y-[1px] transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="w-full">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            Why Choose QuickGig?
          </h2>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-10">
            Made for students who want real experience and clients who want trusted, flexible help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-200 dark:group-hover:bg-sky-800 transition-colors">
                <Shield className="w-6 h-6 text-sky-600 dark:text-sky-300 group-hover:drop-shadow-[0_0_18px_rgba(56,189,248,0.8)] transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Verified Students
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All students pass school ID verification and Asessment Form so clients can hire with confidence.
              </p>
            </div>
            <div className="card text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-200 dark:group-hover:bg-violet-800 transition-colors">
                <Briefcase className="w-6 h-6 text-violet-600 dark:text-violet-300 group-hover:drop-shadow-[0_0_18px_rgba(139,92,246,0.8)] transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Flexible Opportunities
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Short tasks, weekend work, or ongoing help students choose what fits their schedule.
              </p>
            </div>
            <div className="card text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-300 group-hover:drop-shadow-[0_0_18px_rgba(16,185,129,0.8)] transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Smart Matching
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Filters by category, skills, and availability help everyone find the perfect match fast.
              </p>
            </div>
            <div className="card text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
                <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-300 group-hover:drop-shadow-[0_0_18px_rgba(251,191,36,0.8)] transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Secure Payments
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Safe, reliable payments via GCash and PayPal, with clear tracking for both sides.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white/80 dark:bg-slate-900/80 py-16 rounded-3xl w-full border border-slate-100 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-10">
            Three simple steps for both students and clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-sky-400/40">
                1
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Create Account</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sign up as a student or client. Students quickly verify with their school ID and Assessment Form.
              </p>
            </div>
            <div className="text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-violet-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-violet-400/40">
                2
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Connect & Apply
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Students browse and apply to gigs while clients post jobs and review applicants.
              </p>
            </div>
            <div className="text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-emerald-400/40">
                3
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Complete & Earn</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Finish the gig, get rated, and receive secure payments via GCash or PayPal.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Benefits for Everyone
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Students */}
            <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-sky-600 dark:text-sky-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">For Students</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Earn money with flexible part-time gigs that fit your life.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Build a real portfolio and gain experience before graduation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Control your availability around exams, projects, and breaks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Get rated and build a reputation you can show future employers.
                  </span>
                </li>
              </ul>
            </div>

            {/* For Clients */}
            <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-600 dark:text-violet-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">For Clients</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Quickly find verified, motivated students for your tasks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Post jobs for free, review applicants, and choose the best fit.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Get affordable rates while supporting students in your community.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Rate and review students, helping top performers stand out.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Recent Gigs */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recent Gigs</h2>
            <Link to="/gigs">
              <Button variant="outline" className="rounded-full">
                View All
              </Button>
            </Link>
          </div>
          {recentGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentGigs.map((gig) => (
                <div key={gig.id} className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl">
                  <GigCard gig={gig} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No gigs available at the moment. Check back later!
              </p>
            </div>
          )}
        </section>

        {/* Call to Action */}
        {!user && (
          <section className="bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white py-16 rounded-3xl text-center shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of students and clients already using QuickGig.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register?role=student">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-sky-700 hover:bg-slate-100 flex items-center gap-2 rounded-full px-7"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Join as Student</span>
                </Button>
              </Link>
              <Link to="/register?role=client">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 flex items-center gap-2 rounded-full px-7"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Join as Client</span>
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

