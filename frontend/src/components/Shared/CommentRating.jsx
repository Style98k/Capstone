import { useState } from 'react'
import { Star, MessageSquare, Calendar } from 'lucide-react'
import Card from '../UI/Card'
import { mockRatings } from '../../data/mockRatings'
import { mockUsers } from '../../data/mockUsers'
import { mockGigs } from '../../data/mockGigs'

export default function CommentRating({ userId, userRole = 'student' }) {
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, highest, lowest

  // Get all ratings for this user
  const userRatings = mockRatings
    .filter(rating => rating.targetUserId === userId)
    .map(rating => ({
      ...rating,
      rater: mockUsers.find(u => u.id === rating.raterId),
      gig: mockGigs.find(g => g.id === rating.gigId),
    }))
    .filter(rating => rating.rater) // Only show ratings where we have rater info

  // Calculate average rating
  const averageRating = userRatings.length > 0
    ? (userRatings.reduce((sum, r) => sum + r.stars, 0) / userRatings.length).toFixed(1)
    : 0

  // Sort ratings
  const sortedRatings = [...userRatings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'highest':
        return b.stars - a.stars
      case 'lowest':
        return a.stars - b.stars
      default:
        return 0
    }
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Ratings & Reviews
          </h2>
          {userRatings.length > 0 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          )}
        </div>

        {/* Average Rating Summary */}
        {userRatings.length > 0 ? (
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({userRatings.length} {userRatings.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(parseFloat(averageRating))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No ratings or reviews yet</p>
          </div>
        )}
      </div>

      {/* Ratings List */}
      {sortedRatings.length > 0 && (
        <div className="space-y-4">
          {sortedRatings.map((rating) => (
            <div
              key={rating.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Rater Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {getInitials(rating.rater?.name || 'U')}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Rater Name and Rating */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {rating.rater?.name || 'Anonymous'}
                      </h4>
                      {rating.gig && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          For: {rating.gig.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating.stars
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Comment */}
                  {rating.review && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
                      {rating.review}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(rating.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

