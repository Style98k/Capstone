/**
 * Notification Manager Utility
 * Handles all notification logic including creation, storage, and event dispatching
 */

/**
 * Trigger a new notification for a specific role
 * @param {string} targetRole - The user role ('student', 'client', 'admin')
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type for routing (e.g., 'payment', 'verification', 'application')
 */
export const triggerNotification = (targetRole, title, message, type) => {
  try {
    // Validate inputs
    if (!targetRole || !title || !message || !type) {
      console.error('Missing required notification parameters');
      return false;
    }

    const notificationKey = `notifications_${targetRole}`;
    
    // Get existing notifications for this role
    const existingNotifications = localStorage.getItem(notificationKey);
    const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];

    // Create new notification object
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      isUnread: true,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Add to array
    notifications.push(newNotification);

    // Save back to localStorage
    localStorage.setItem(notificationKey, JSON.stringify(notifications));

    // Dispatch custom event to notify listeners
    window.dispatchEvent(
      new CustomEvent('notificationUpdate', {
        detail: { role: targetRole, notification: newNotification }
      })
    );

    console.log(`Notification triggered for ${targetRole}:`, newNotification);
    return true;
  } catch (error) {
    console.error('Error triggering notification:', error);
    return false;
  }
};

/**
 * Get all notifications for a specific role
 * @param {string} role - The user role
 * @returns {Array} Array of notifications
 */
export const getNotifications = (role) => {
  try {
    if (!role) return [];
    const notificationKey = `notifications_${role}`;
    const stored = localStorage.getItem(notificationKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

/**
 * Mark a notification as read
 * @param {string} role - The user role
 * @param {number} notificationId - The notification ID
 */
export const markNotificationAsRead = (role, notificationId) => {
  try {
    const notificationKey = `notifications_${role}`;
    const notifications = getNotifications(role);
    
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, isUnread: false, read: true } : n
    );

    localStorage.setItem(notificationKey, JSON.stringify(updated));
    
    // Dispatch event
    window.dispatchEvent(
      new CustomEvent('notificationUpdate', {
        detail: { role, type: 'marked_read', notificationId }
      })
    );

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Clear all notifications for a role
 * @param {string} role - The user role
 */
export const clearNotifications = (role) => {
  try {
    const notificationKey = `notifications_${role}`;
    localStorage.removeItem(notificationKey);
    
    window.dispatchEvent(
      new CustomEvent('notificationUpdate', {
        detail: { role, type: 'cleared' }
      })
    );

    return true;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
};

/**
 * Get unread count for a role
 * @param {string} role - The user role
 * @returns {number} Count of unread notifications
 */
export const getUnreadCount = (role) => {
  const notifications = getNotifications(role);
  return notifications.filter(n => n.isUnread).length;
};

/**
 * Initialize sample notifications for a role (for testing)
 * @param {string} role - The user role
 */
export const initializeSampleNotifications = (role) => {
  const samples = {
    student: [
      {
        id: Date.now(),
        title: 'Payment Received',
        message: 'You received ₱500 for your tutoring session',
        type: 'payment',
        isUnread: true,
        timestamp: new Date().toISOString(),
        read: false
      }
    ],
    client: [
      {
        id: Date.now(),
        title: 'New Applicant',
        message: 'Maria applied for Math Tutor position',
        type: 'application',
        isUnread: true,
        timestamp: new Date().toISOString(),
        read: false
      }
    ],
    admin: [
      {
        id: Date.now(),
        title: 'Pending ID Verification',
        message: 'Carlos submitted an ID for review',
        type: 'verification',
        isUnread: true,
        timestamp: new Date().toISOString(),
        read: false
      }
    ]
  };

  const notificationKey = `notifications_${role}`;
  if (!localStorage.getItem(notificationKey)) {
    localStorage.setItem(notificationKey, JSON.stringify(samples[role] || []));
  }
};
