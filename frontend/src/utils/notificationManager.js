/**
 * Notification Manager Utility
 * Handles all notification logic including creation, storage, and event dispatching
 */

/**
 * Trigger notification to single or multiple roles
 * @param {string|array} targetRole - The user role(s) ('student', 'client', 'admin') or array of roles
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type for routing
 */
export const triggerNotification = (targetRole, title, message, type) => {
  // Support both single role and multiple roles
  const roles = Array.isArray(targetRole) ? targetRole : [targetRole];
  
  roles.forEach(role => {
    // 1. Determine the key (e.g., 'notifications_admin')
    const storageKey = `notifications_${role}`;
    
    // 2. Get existing data
    const currentData = localStorage.getItem(storageKey);
    const existing = currentData ? JSON.parse(currentData) : [];
    
    // 3. Add new notification
    const newNotif = {
      id: Date.now() + Math.random(), // Unique ID for each role
      title,
      message,
      type, 
      isUnread: true,
      timestamp: new Date().toISOString()
    };
    
    // 4. Save and Dispatch Event
    localStorage.setItem(storageKey, JSON.stringify([newNotif, ...existing]));
    window.dispatchEvent(new Event("storage")); 
  });
};

export const getNotifications = (role) => {
  const storageKey = `notifications_${role}`;
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : [];
};

export const markNotificationAsRead = (role, notificationId) => {
  const storageKey = `notifications_${role}`;
  const notifications = getNotifications(role);
  
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, isUnread: false } : n
  );
  
  localStorage.setItem(storageKey, JSON.stringify(updated));
  window.dispatchEvent(new Event("storage"));
};

export const clearNotifications = (role) => {
  const storageKey = `notifications_${role}`;
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event("storage"));
};

export const getUnreadCount = (role) => {
  const notifications = getNotifications(role);
  return notifications.filter(n => n.isUnread).length;
};
/**
 * Trigger notification to a specific user by ID
 * @param {string|number} userId - The specific user ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type for routing
 */
export const triggerUserNotification = (userId, title, message, type) => {
  if (!userId) return; // Safety check

  // 1. Determine the key for user-specific notifications
  const storageKey = `notifications_user_${userId}`;
  
  // 2. Get existing data
  const currentData = localStorage.getItem(storageKey);
  const existing = currentData ? JSON.parse(currentData) : [];
  
  // 3. Add new notification
  const newNotif = {
    id: Date.now() + Math.random(),
    title,
    message,
    type,
    isUnread: true,
    timestamp: new Date().toISOString()
  };
  
  // 4. Save and Dispatch Event
  localStorage.setItem(storageKey, JSON.stringify([newNotif, ...existing]));
  window.dispatchEvent(new Event("storage"));
};

/**
 * Get notifications for a specific user ID
 * @param {string|number} userId - The user ID
 * @returns {array} Array of notifications
 */
export const getUserNotifications = (userId) => {
  if (!userId) return [];
  const storageKey = `notifications_user_${userId}`;
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : [];
};

/**
 * Mark user notification as read
 * @param {string|number} userId - The user ID
 * @param {string|number} notificationId - The notification ID
 */
export const markUserNotificationAsRead = (userId, notificationId) => {
  if (!userId) return;
  const storageKey = `notifications_user_${userId}`;
  const notifications = getUserNotifications(userId);
  
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, isUnread: false } : n
  );
  
  localStorage.setItem(storageKey, JSON.stringify(updated));
  window.dispatchEvent(new Event("storage"));
};

/**
 * Clear all notifications for a specific user
 * @param {string|number} userId - The user ID
 */
export const clearUserNotifications = (userId) => {
  if (!userId) return;
  const storageKey = `notifications_user_${userId}`;
  localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event("storage"));
};

/**
 * Get unread count for a specific user
 * @param {string|number} userId - The user ID
 * @returns {number} Unread notification count
 */
export const getUserUnreadCount = (userId) => {
  if (!userId) return 0;
  const notifications = getUserNotifications(userId);
  return notifications.filter(n => n.isUnread).length;
};