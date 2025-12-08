import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { categories, locations } from '../../data/mockGigs'
import { getOpenGigs, initializeLocalStorage } from '../../utils/localStorage'
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

  // Initialize localStorage and get gigs
  const gigs = useMemo(() => {
    initializeLocalStorage()
    return getOpenGigs()
  }, [])

  const filteredGigs = useMemo(() => {
    let filtered = gigs.filter(g => g.status === 'open')

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
  }, [search, category, location, minPay, sortBy, gigs])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Gigs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Find the perfect gig for your skills
          </p>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="card border-sky-100/70 dark:border-slate-800 bg-gradient-to-br from-white via-sky-50/40 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 backdrop-blur"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-sky-50 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Filter className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              label=""
              type="text"
              placeholder="Search gigs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={Search}
            />
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
      </motion.div>

      {/* Results */}
      <div className="card bg-white/90 dark:bg-slate-900/90 border border-sky-50 dark:border-slate-800">
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-xs">
            {filteredGigs.length}
          </span>
          Found {filteredGigs.length} gig{filteredGigs.length !== 1 ? 's' : ''}
        </p>
        {filteredGigs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGigs.map((gig, index) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
              >
                <GigCard gig={gig} />
              </motion.div>
            ))}
          </motion.div>
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

