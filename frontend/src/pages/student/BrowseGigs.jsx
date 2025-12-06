import { useState, useMemo } from 'react'
import { mockGigs, categories, locations } from '../../data/mockGigs'
import GigCard from '../../components/Shared/GigCard'
import Input from '../../components/UI/Input'
import Select from '../../components/UI/Select'
import { Search, Filter } from 'lucide-react'

export default function BrowseGigs() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [minPay, setMinPay] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredGigs = useMemo(() => {
    let filtered = mockGigs.filter(g => g.status === 'open')

    if (search) {
      filtered = filtered.filter(
        g =>
          g.title.toLowerCase().includes(search.toLowerCase()) ||
          g.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
          g.category.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filtered = filtered.filter(g => g.category === category)
    }

    if (location) {
      filtered = filtered.filter(g => g.location === location)
    }

    if (minPay) {
      filtered = filtered.filter(g => g.pay >= Number(minPay))
    }

    // Sort
    if (sortBy === 'pay-desc') {
      filtered.sort((a, b) => b.pay - a.pay)
    } else if (sortBy === 'pay-asc') {
      filtered.sort((a, b) => a.pay - b.pay)
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return filtered
  }, [search, category, location, minPay, sortBy])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Gigs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find the perfect gig for your skills
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gigs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <Select
            label=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories}
            placeholder="All Categories"
          />
          <Select
            label=""
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            options={locations}
            placeholder="All Locations"
          />
          <Select
            label=""
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'pay-desc', label: 'Highest Pay' },
              { value: 'pay-asc', label: 'Lowest Pay' },
            ]}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Minimum Pay (₱)"
            type="number"
            value={minPay}
            onChange={(e) => setMinPay(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Found {filteredGigs.length} gig{filteredGigs.length !== 1 ? 's' : ''}
        </p>
        {filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No gigs found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

