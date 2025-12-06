import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useLocalAuth'
import { mockGigs } from '../data/mockGigs'
import GigCard from '../components/Shared/GigCard'
import Button from '../components/UI/Button'
import { Briefcase, Users, Shield, TrendingUp, Clock, DollarSign, CheckCircle, Star } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const recentGigs = mockGigs.filter(g => g.status === 'open').slice(0, 6)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Perfect Gig
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Connect students with short-term freelance opportunities. Flexible, verified, and local.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {!user && (
            <>
              <Link to="/register?role=student">
                <Button size="lg">Join as Student</Button>
              </Link>
              <Link to="/register?role=client">
                <Button variant="outline" size="lg">
                  Join as Client
                </Button>
              </Link>
              <Link to="/gigs">
                <Button variant="outline" size="lg">
                  Browse Gigs
                </Button>
              </Link>
            </>
          )}
          {user && (
            <div className="w-full max-w-2xl mx-auto mt-8">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Welcome back, {user.name}! Continue managing your {user.role === 'student' ? 'applications and earnings' : user.role === 'client' ? 'job posts and applicants' : 'platform'}.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to={user.role === 'student' ? '/student/dashboard' : user.role === 'client' ? '/client/dashboard' : '/admin/dashboard'}>
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
                <Link to="/gigs">
                  <Button variant="outline" size="lg">
                    Browse Gigs
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-primary-100">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">200+</div>
            <div className="text-primary-100">Verified Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">1,000+</div>
            <div className="text-primary-100">Completed Gigs</div>
          </div>
        </div>
      </section>

      {/* What is QuickGig Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            What is QuickGig?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            QuickGig is a revolutionary platform designed to bridge the gap between students seeking flexible work opportunities and clients looking for reliable, affordable services. Whether you're a student looking to earn extra income around your class schedule, or a client needing help with various tasks, QuickGig makes it easy to connect and collaborate.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our platform ensures all students are verified through school ID verification, providing clients with peace of mind. With secure payment processing, transparent ratings, and an easy-to-use interface, QuickGig is the perfect solution for short-term freelance work.
          </p>
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Tutoring', 'Household', 'Administrative', 'Delivery', 'Event Help', 'Tech Support', 'Data Entry', 'Photography'].map((category) => (
            <Link
              key={category}
              to="/gigs"
              className="card text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-primary-100">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">200+</div>
            <div className="text-primary-100">Verified Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">1,000+</div>
            <div className="text-primary-100">Completed Gigs</div>
          </div>
        </div>
      </section>

      {/* What is QuickGig Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            What is QuickGig?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            QuickGig is a revolutionary platform designed to bridge the gap between students seeking flexible work opportunities and clients looking for reliable, affordable services. Whether you're a student looking to earn extra income around your class schedule, or a client needing help with various tasks, QuickGig makes it easy to connect and collaborate.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our platform ensures all students are verified through school ID verification, providing clients with peace of mind. With secure payment processing, transparent ratings, and an easy-to-use interface, QuickGig is the perfect solution for short-term freelance work.
          </p>
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Tutoring', 'Household', 'Administrative', 'Delivery', 'Event Help', 'Tech Support', 'Data Entry', 'Photography'].map((category) => (
            <Link
              key={category}
              to="/gigs"
              className="card text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose QuickGig?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Verified Students
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All students are verified through school ID verification for your peace of mind
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Flexible Opportunities
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Find gigs that fit your schedule and skills, from part-time to full-time
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Easy Matching
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smart filters help you find the perfect match quickly and efficiently
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Secure Payments
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Safe and reliable payment processing via GCash and PayPal
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              500+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              200+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Verified Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              1,000+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Completed Gigs</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign up as a student or client. Students need school ID verification.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Connect & Apply
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Students browse and apply to gigs. Clients post jobs and review applicants.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Complete & Earn</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete gigs, get rated, and receive secure payments via GCash or PayPal.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Benefits for Everyone
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Students */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Students</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Earn money with flexible part-time gigs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Build your portfolio and gain experience
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Work around your class schedule
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Get rated and build your reputation
                </span>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Clients</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Find verified, reliable students quickly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Post jobs for free and review applicants
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Affordable rates from student freelancers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Rate and review students after completion
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recent Gigs */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Gigs</h2>
          <Link to="/gigs">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {recentGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No gigs available at the moment. Check back later!
            </p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="bg-primary-600 text-white py-16 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of students and clients already using QuickGig
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register?role=student">
              <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                Join as Student
              </Button>
            </Link>
            <Link to="/register?role=client">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Join as Client
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

