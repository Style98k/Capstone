// Rating Utility Functions for Two-Way Rating System

export const RATINGS_KEY = 'quickgig_ratings'

/**
 * Get rating data for a specific user
 * @param {string} targetUserId - The user ID to get ratings for
 * @returns {Object} - { average: number, count: number, reviews: Array }
 */
export const getUserRating = (targetUserId) => {
  const allRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]')
  const userReviews = allRatings.filter(r => r.targetId === targetUserId)

  if (userReviews.length === 0) {
    return { average: 0, count: 0, reviews: [] }
  }

  const totalStars = userReviews.reduce((sum, r) => sum + r.rating, 0)
  const average = (totalStars / userReviews.length).toFixed(1)

  return {
    average: parseFloat(average),
    count: userReviews.length,
    reviews: userReviews.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
}

/**
 * Save a new rating
 * @param {Object} ratingData - The rating data to save
 * @returns {Object} - { success: boolean, rating?: Object, error?: string }
 */
export const saveRating = (ratingData) => {
  try {
    const allRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]')

    // Check if user already rated this target for this gig
    const existingIndex = allRatings.findIndex(
      r => r.raterId === ratingData.raterId &&
           r.targetId === ratingData.targetId &&
           r.gigId === ratingData.gigId
    )

    if (existingIndex !== -1) {
      // Update existing rating
      allRatings[existingIndex] = {
        ...allRatings[existingIndex],
        rating: ratingData.rating,
        comment: ratingData.comment,
        date: new Date().toISOString()
      }
    } else {
      // Add new rating
      const newRating = {
        id: Date.now(),
        raterId: ratingData.raterId,
        raterName: ratingData.raterName,
        raterRole: ratingData.raterRole,
        targetId: ratingData.targetId,
        gigId: ratingData.gigId,
        gigTitle: ratingData.gigTitle,
        rating: ratingData.rating,
        comment: ratingData.comment,
        date: new Date().toISOString()
      }
      allRatings.push(newRating)
    }

    localStorage.setItem(RATINGS_KEY, JSON.stringify(allRatings))
    window.dispatchEvent(new Event('storage'))

    return { success: true, rating: ratingData }
  } catch (error) {
    console.error('Error saving rating:', error)
    return { success: false, error: 'Failed to save rating' }
  }
}

/**
 * Check if a user has already rated for a specific gig
 * @param {string} raterId - The user doing the rating
 * @param {string} targetId - The user being rated
 * @param {string} gigId - The gig ID
 * @returns {boolean}
 */
export const hasRated = (raterId, targetId, gigId) => {
  const allRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]')
  return allRatings.some(
    r => r.raterId === raterId && r.targetId === targetId && r.gigId === gigId
  )
}

/**
 * Get all ratings for a gig
 * @param {string} gigId - The gig ID
 * @returns {Array}
 */
export const getRatingsByGig = (gigId) => {
  const allRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]')
  return allRatings.filter(r => r.gigId === gigId)
}
