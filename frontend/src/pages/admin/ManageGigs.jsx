import { useState } from 'react'
import { mockGigs } from '../../data/mockGigs'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { Trash2, Eye } from 'lucide-react'

export default function ManageGigs() {
  const [gigs, setGigs] = useState(mockGigs)
  const [filter, setFilter] = useState('')

  const filteredGigs = gigs.filter(
    g =>
      g.title.toLowerCase().includes(filter.toLowerCase()) ||
      g.category.toLowerCase().includes(filter.toLowerCase())
  )

  const handleDelete = (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      setGigs(gigs.filter(g => g.id !== gigId))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Gigs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Moderate and manage all job postings
        </p>
      </div>

      <Card>
        <input
          type="text"
          placeholder="Search gigs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input mb-4"
        />
      </Card>

      <div className="space-y-4">
        {filteredGigs.map((gig) => (
          <Card key={gig.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{gig.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {gig.shortDesc}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    {gig.category}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    {gig.location}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                    ₱{gig.pay.toLocaleString()}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${
                      gig.status === 'open'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {gig.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(gig.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

