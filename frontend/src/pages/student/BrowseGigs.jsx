import { useState, useMemo } from 'react'
import { useAuth } from '../../hooks/useLocalAuth'
import { getGigs, initializeLocalStorage } from '../../utils/localStorage'
import { categories } from '../../data/mockGigs'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Select from '../../components/UI/Select'
import Button from '../../components/UI/Button'
import { MapPin, Clock, Coins, Star, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BrowseGigs() {
    const { user } = useAuth()

    // Task 1: Filter & sort state variables with specified defaults
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [selectedLocation, setSelectedLocation] = useState('All Locations')
    const [sortBy, setSortBy] = useState('Newest')

    // Initialize localStorage and get all gigs
    const allGigs = useMemo(() => {
        initializeLocalStorage()
        return getGigs()
    }, [])



    // Task 2 & 3: Filter and sort gigs
    const filteredGigs = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase()

        let filtered = allGigs.filter(gig => {
            // Status: Only show open gigs
            if (gig.status !== 'open') return false

            // Search: Check if title, description, or location includes the searchTerm
            const matchesSearch = !searchTerm ||
                (gig.title || '').toLowerCase().includes(lowerSearch) ||
                (gig.description || '').toLowerCase().includes(lowerSearch) ||
                (gig.location || '').toLowerCase().includes(lowerSearch)

            // Category: If not 'All Categories', match gig.category exactly
            const matchesCategory = selectedCategory === 'All Categories' ||
                gig.category === selectedCategory

            // Location: If 'Online', show only online gigs (check locationType field, fallback to location string)
            const matchesLocation = selectedLocation === 'All Locations' ||
                (selectedLocation === 'Online' && (
                    gig.locationType === 'online' ||
                    gig.locationType === 'remote' ||
                    (gig.location || '').toLowerCase().includes('online')
                ))

            return matchesSearch && matchesCategory && matchesLocation
        })

        // Task 3: Apply sorting
        switch (sortBy) {
            case 'Newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            case 'Oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                break
            case 'Highest Pay':
                filtered.sort((a, b) => (b.pay || 0) - (a.pay || 0))
                break
            case 'Lowest Pay':
                filtered.sort((a, b) => (a.pay || 0) - (b.pay || 0))
                break
            default:
                break
        }

        return filtered
    }, [allGigs, searchTerm, selectedCategory, selectedLocation, sortBy])

    // Reset all filters to defaults
    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCategory('All Categories')
        setSelectedLocation('All Locations')
        setSortBy('Newest')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Browse Gigs
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Find the perfect gig for your skills
                </p>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search
                        </label>
                        <Input
                            type="text"
                            placeholder="Search gigs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={Search}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            options={[
                                { value: 'All Categories', label: 'All Categories' },
                                ...categories.map(cat => ({ value: cat, label: cat }))
                            ]}
                        />
                        <Select
                            label="Location"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            options={[
                                { value: 'All Locations', label: 'All Locations' },
                                { value: 'Online', label: 'Online' },
                            ]}
                        />
                        <Select
                            label="Sort By"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            options={[
                                { value: 'Newest', label: 'Newest' },
                                { value: 'Oldest', label: 'Oldest' },
                                { value: 'Highest Pay', label: 'Highest Pay' },
                                { value: 'Lowest Pay', label: 'Lowest Pay' },
                            ]}
                        />
                    </div>
                </div>
            </Card>

            {/* Results */}
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Found <strong>{filteredGigs.length}</strong> gigs
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGigs.length > 0 ? (
                        filteredGigs.map(gig => (
                            <Card key={gig.id} hover className="p-6 flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded text-xs font-medium">
                                        {gig.category}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
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
                                        {gig.skills.slice(0, 3).map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    to={`/gigs/${gig.id}`}
                                    className="btn btn-primary w-full text-center"
                                >
                                    View Details
                                </Link>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                No gigs found matching your filters
                            </p>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

