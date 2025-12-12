// Local Storage Data Management Utilities
import { mockGigs } from '../data/mockGigs.js'
import { mockApplications } from '../data/mockApplications.js'

export const localStorageKeys = {
  GIGS: 'quickgig_gigs',
  APPLICATIONS: 'quickgig_applications',
  USERS: 'quickgig_users'
}

// Initialize localStorage with mock data if empty
export const initializeLocalStorage = () => {
  // Initialize gigs if empty
  if (!localStorage.getItem(localStorageKeys.GIGS)) {
    localStorage.setItem(localStorageKeys.GIGS, JSON.stringify(mockGigs))
  }

  // Initialize applications if empty
  if (!localStorage.getItem(localStorageKeys.APPLICATIONS)) {
    localStorage.setItem(localStorageKeys.APPLICATIONS, JSON.stringify(mockApplications))
  }
}

// GIG MANAGEMENT
export const getGigs = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKeys.GIGS) || '[]')
  } catch (error) {
    console.error('Error reading gigs from localStorage:', error)
    return []
  }
}

export const saveGig = (gigData) => {
  try {
    const gigs = getGigs()
    const newGig = {
      id: `gig_${Date.now()}`,
      ...gigData,
      status: 'open',
      createdAt: new Date().toISOString()
    }

    gigs.push(newGig)
    localStorage.setItem(localStorageKeys.GIGS, JSON.stringify(gigs))
    // Dispatch storage event for immediate UI updates across tabs/components
    window.dispatchEvent(new Event('storage'))
    return { success: true, gig: newGig }
  } catch (error) {
    console.error('Error saving gig to localStorage:', error)
    return { success: false, error: 'Failed to save gig' }
  }
}

export const updateGig = (gigId, updates) => {
  try {
    const gigs = getGigs()
    const gigIndex = gigs.findIndex(gig => gig.id === gigId)

    if (gigIndex === -1) {
      return { success: false, error: 'Gig not found' }
    }

    gigs[gigIndex] = { ...gigs[gigIndex], ...updates }
    localStorage.setItem(localStorageKeys.GIGS, JSON.stringify(gigs))
    return { success: true, gig: gigs[gigIndex] }
  } catch (error) {
    console.error('Error updating gig in localStorage:', error)
    return { success: false, error: 'Failed to update gig' }
  }
}

export const deleteGig = (gigId) => {
  try {
    const gigs = getGigs()
    const filteredGigs = gigs.filter(gig => gig.id !== gigId)

    if (filteredGigs.length === gigs.length) {
      return { success: false, error: 'Gig not found' }
    }

    localStorage.setItem(localStorageKeys.GIGS, JSON.stringify(filteredGigs))
    return { success: true }
  } catch (error) {
    console.error('Error deleting gig from localStorage:', error)
    return { success: false, error: 'Failed to delete gig' }
  }
}

export const getGigsByOwner = (ownerId) => {
  const gigs = getGigs()
  return gigs.filter(gig => gig.ownerId === ownerId)
}

export const getOpenGigs = () => {
  const gigs = getGigs()
  return gigs.filter(gig => gig.status === 'open')
}

// APPLICATION MANAGEMENT
export const getApplications = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKeys.APPLICATIONS) || '[]')
  } catch (error) {
    console.error('Error reading applications from localStorage:', error)
    return []
  }
}

export const saveApplication = (applicationData) => {
  try {
    const applications = getApplications()
    const newApplication = {
      id: `app_${Date.now()}`,
      ...applicationData,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    applications.push(newApplication)
    localStorage.setItem(localStorageKeys.APPLICATIONS, JSON.stringify(applications))
    return { success: true, application: newApplication }
  } catch (error) {
    console.error('Error saving application to localStorage:', error)
    return { success: false, error: 'Failed to save application' }
  }
}

export const updateApplication = (applicationId, updates) => {
  try {
    const applications = getApplications()
    const appIndex = applications.findIndex(app => app.id === applicationId)

    if (appIndex === -1) {
      return { success: false, error: 'Application not found' }
    }

    applications[appIndex] = {
      ...applications[appIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    localStorage.setItem(localStorageKeys.APPLICATIONS, JSON.stringify(applications))
    return { success: true, application: applications[appIndex] }
  } catch (error) {
    console.error('Error updating application in localStorage:', error)
    return { success: false, error: 'Failed to update application' }
  }
}

export const getApplicationsByGig = (gigId) => {
  const applications = getApplications()
  return applications.filter(app => app.gigId === gigId)
}

export const getApplicationsByUser = (userId) => {
  const applications = getApplications()
  return applications.filter(app => app.userId === userId)
}

export const getApplicationsForClient = (clientId) => {
  // Get all gigs owned by this client
  const clientGigs = getGigsByOwner(clientId)
  const gigIds = clientGigs.map(gig => gig.id)

  // Get all applications for these gigs
  const applications = getApplications()
  return applications.filter(app => gigIds.includes(app.gigId))
}
