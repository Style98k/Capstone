// Local Storage Data Management Utilities
import { mockGigs } from '../data/mockGigs.js'
import { mockApplications } from '../data/mockApplications.js'

export const localStorageKeys = {
  GIGS: 'quickgig_gigs_v2',
  APPLICATIONS: 'quickgig_applications_v2',
  USERS: 'quickgig_users_v2',
  TRANSACTIONS: 'quickgig_transactions_v2',
  CONVERSATIONS: 'quickgig_conversations_v2',
  MESSAGES: 'quickgig_messages_v2'
}

// Initialize localStorage with empty data if not present (clean start for testing)
export const initializeLocalStorage = () => {
  // Initialize gigs if empty - start with empty array for clean testing
  if (!localStorage.getItem(localStorageKeys.GIGS)) {
    localStorage.setItem(localStorageKeys.GIGS, JSON.stringify([]))
  }

  // Initialize applications if empty - start with empty array
  if (!localStorage.getItem(localStorageKeys.APPLICATIONS)) {
    localStorage.setItem(localStorageKeys.APPLICATIONS, JSON.stringify([]))
  }

  // Initialize transactions if empty
  if (!localStorage.getItem(localStorageKeys.TRANSACTIONS)) {
    localStorage.setItem(localStorageKeys.TRANSACTIONS, JSON.stringify([]))
  }

  // Initialize conversations if empty
  if (!localStorage.getItem(localStorageKeys.CONVERSATIONS)) {
    localStorage.setItem(localStorageKeys.CONVERSATIONS, JSON.stringify([]))
  }

  // Initialize messages if empty
  if (!localStorage.getItem(localStorageKeys.MESSAGES)) {
    localStorage.setItem(localStorageKeys.MESSAGES, JSON.stringify([]))
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
    // Delete the gig
    const gigs = getGigs()
    const filteredGigs = gigs.filter(gig => gig.id !== gigId)

    if (filteredGigs.length === gigs.length) {
      return { success: false, error: 'Gig not found' }
    }

    localStorage.setItem(localStorageKeys.GIGS, JSON.stringify(filteredGigs))

    // CASCADE DELETE: Remove all related applications
    const applications = JSON.parse(localStorage.getItem(localStorageKeys.APPLICATIONS) || '[]')
    const filteredApps = applications.filter(app => app.gigId !== gigId)
    localStorage.setItem(localStorageKeys.APPLICATIONS, JSON.stringify(filteredApps))

    // CASCADE DELETE: Remove all related conversations
    const conversations = JSON.parse(localStorage.getItem(localStorageKeys.CONVERSATIONS) || '[]')
    const relatedConvIds = conversations.filter(c => c.gigId === gigId).map(c => c.id)
    const filteredConvs = conversations.filter(c => c.gigId !== gigId)
    localStorage.setItem(localStorageKeys.CONVERSATIONS, JSON.stringify(filteredConvs))

    // CASCADE DELETE: Remove all messages from deleted conversations
    if (relatedConvIds.length > 0) {
      const messages = JSON.parse(localStorage.getItem(localStorageKeys.MESSAGES) || '[]')
      const filteredMsgs = messages.filter(m => !relatedConvIds.includes(m.conversationId))
      localStorage.setItem(localStorageKeys.MESSAGES, JSON.stringify(filteredMsgs))
    }

    // Dispatch storage event for UI updates
    window.dispatchEvent(new Event('storage'))

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
    window.dispatchEvent(new Event('storage'))
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

// TRANSACTION MANAGEMENT
export const getTransactions = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKeys.TRANSACTIONS) || '[]')
  } catch (error) {
    console.error('Error reading transactions from localStorage:', error)
    return []
  }
}

export const saveTransaction = (transactionData) => {
  try {
    const transactions = getTransactions()
    const newTransaction = {
      id: `trans_${Date.now()}`,
      ...transactionData,
      status: transactionData.status || 'completed',
      createdAt: new Date().toISOString()
    }

    transactions.push(newTransaction)
    localStorage.setItem(localStorageKeys.TRANSACTIONS, JSON.stringify(transactions))
    // Dispatch storage event for immediate UI updates
    window.dispatchEvent(new Event('storage'))
    return { success: true, transaction: newTransaction }
  } catch (error) {
    console.error('Error saving transaction to localStorage:', error)
    return { success: false, error: 'Failed to save transaction' }
  }
}

export const updateTransaction = (transactionId, updates) => {
  try {
    const transactions = getTransactions()
    const index = transactions.findIndex(t => t.id === transactionId)
    
    if (index === -1) {
      return { success: false, error: 'Transaction not found' }
    }
    
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(localStorageKeys.TRANSACTIONS, JSON.stringify(transactions))
    window.dispatchEvent(new Event('storage'))
    return { success: true, transaction: transactions[index] }
  } catch (error) {
    console.error('Error updating transaction:', error)
    return { success: false, error: 'Failed to update transaction' }
  }
}

export const getTransactionsByUser = (userId) => {
  const transactions = getTransactions()
  return transactions.filter(t => t.fromUserId === userId || t.toUserId === userId)
}

// CONVERSATION MANAGEMENT
export const getConversations = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKeys.CONVERSATIONS) || '[]')
  } catch (error) {
    console.error('Error reading conversations from localStorage:', error)
    return []
  }
}

export const getConversationsByUser = (userId) => {
  const conversations = getConversations()
  return conversations.filter(c => c.participants.includes(userId))
}

export const saveConversation = (conversationData) => {
  try {
    const conversations = getConversations()

    // Check if conversation already exists between these participants for this gig
    const existing = conversations.find(c =>
      c.gigId === conversationData.gigId &&
      c.participants.includes(conversationData.participants[0]) &&
      c.participants.includes(conversationData.participants[1])
    )

    if (existing) {
      return { success: true, conversation: existing, isNew: false }
    }

    const newConversation = {
      id: `conv_${Date.now()}`,
      ...conversationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    conversations.push(newConversation)
    localStorage.setItem(localStorageKeys.CONVERSATIONS, JSON.stringify(conversations))
    window.dispatchEvent(new Event('storage'))
    return { success: true, conversation: newConversation, isNew: true }
  } catch (error) {
    console.error('Error saving conversation to localStorage:', error)
    return { success: false, error: 'Failed to save conversation' }
  }
}

// MESSAGE MANAGEMENT
export const getMessages = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKeys.MESSAGES) || '[]')
  } catch (error) {
    console.error('Error reading messages from localStorage:', error)
    return []
  }
}

export const getMessagesByConversation = (conversationId) => {
  const messages = getMessages()
  return messages.filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

export const saveMessage = (messageData) => {
  try {
    const messages = getMessages()
    const newMessage = {
      id: `msg_${Date.now()}`,
      ...messageData,
      timestamp: new Date().toISOString()
    }

    messages.push(newMessage)
    localStorage.setItem(localStorageKeys.MESSAGES, JSON.stringify(messages))

    // Update conversation's last message
    const conversations = getConversations()
    const convIndex = conversations.findIndex(c => c.id === messageData.conversationId)
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = messageData.content
      conversations[convIndex].updatedAt = newMessage.timestamp
      localStorage.setItem(localStorageKeys.CONVERSATIONS, JSON.stringify(conversations))
    }

    window.dispatchEvent(new Event('storage'))
    return { success: true, message: newMessage }
  } catch (error) {
    console.error('Error saving message to localStorage:', error)
    return { success: false, error: 'Failed to save message' }
  }
}

