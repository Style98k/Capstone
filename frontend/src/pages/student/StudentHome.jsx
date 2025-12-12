import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Clock, Coins, TrendingUp } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { getGigs, initializeLocalStorage } from '../../utils/localStorage'

export default function StudentHome() {
    // Initialize localStorage and get all gigs
    const featuredGigs = useMemo(() => {
        initializeLocalStorage()
        const allGigs = getGigs()
        // Get gigs that are available (not hired/closed) and sort by newest
        return allGigs
            .filter(gig => gig.status !== 'closed' && gig.status !== 'hired')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6) // Show top 6
    }, [])

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center space-y-6 mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                            Find Your Next <span className="text-primary-600">Opportunity</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Connect with clients looking for your skills. Start earning as a student freelancer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/student/browse" className="btn btn-primary">
                                Browse Gigs
                            </Link>
                            <Link to="/student/profile" className="btn btn-outline">
                                Complete Your Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Gigs */}
            {featuredGigs.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Featured Opportunities
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Latest gigs posted by clients
                            </p>
                        </div>
                        <Link to="/student/browse" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredGigs.map(gig => (
                            <Card key={gig.id} hover className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded text-xs font-medium">
                                        {gig.category}
                                    </span>
                                    <span className="text-sm font-bold text-primary-600">
                                        ₱{(gig.pay || 0).toLocaleString()}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex-grow">
                                    {gig.title}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {gig.description}
                                </p>

                                <div className="space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{gig.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{gig.duration}</span>
                                    </div>
                                </div>

                                {gig.skills && gig.skills.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {gig.skills.slice(0, 2).map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    to={`/gigs/${gig.id}`}
                                    className="btn btn-primary w-full text-center mt-auto"
                                >
                                    View Details
                                </Link>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Stats Section */}
            <section className="bg-primary-600 dark:bg-primary-900 rounded-2xl p-12 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <p className="opacity-90">Active Gigs</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">₱50K+</div>
                            <p className="opacity-90">Earned by Students</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">200+</div>
                            <p className="opacity-90">Successful Students</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center py-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Get Started?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Complete your profile and start applying for gigs today. Show clients what you can do!
                </p>
                <Link to="/student/browse" className="btn btn-primary inline-block">
                    Start Browsing Gigs
                </Link>
            </section>
        </div>
    )
}
