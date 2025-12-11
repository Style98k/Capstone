/**
 * Notification Manager Utility
 * Handles all notification logic including creation, storage, and event dispatching
 */

export const triggerNotification = (targetRole, title, message, type) => {
  // 1. Determine the key (e.g., 'notifications_admin')
  const storageKey = `notifications_${targetRole}`;
  
  // 2. Get existing data
  const currentData = localStorage.getItem(storageKey);
  const existing = currentData ? JSON.parse(currentData) : [];
  
  // 3. Add new notification
  const newNotif = {
    id: Date.now(),
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
