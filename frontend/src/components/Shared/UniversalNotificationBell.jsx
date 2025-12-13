import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useLocalAuth';
import { notificationsAPI } from '../../utils/api';

export default function UniversalNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  // Fetch notifications from database
  const fetchNotifications = async () => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }
    
    try {
      const data = await notificationsAPI.getByUser(user.id);
      // Map database fields to component format
      const mapped = (data || []).map(n => ({
        id: n.id,
        title: n.title || 'Notification',
        message: n.message,
        type: n.type || 'general',
        isUnread: !n.is_read,
        link: n.link,
        timestamp: n.created_at,
        time: formatTime(n.created_at)
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Initialize and load notifications
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const getNavigationPath = (notification) => {
    // Use stored link if available
    if (notification.link) {
      return notification.link;
    }
    
    const type = notification.type;
    const userRole = user?.role;
    
    if (userRole === 'student') {
      switch (type) {
        case 'payment':
          return '/student/earnings';
        case 'application':
          return '/student/applications';
        case 'new_gig':
        case 'gig':
          return '/student/browse';
        default:
          return '/student/dashboard';
      }
    } else if (userRole === 'client') {
      switch (type) {
        case 'application':
          return '/client/applicants';
        case 'job_completed':
          return '/client/manage-gigs';
        case 'payment':
          return '/client/payments';
        default:
          return '/client/dashboard';
      }
    } else if (userRole === 'admin') {
      switch (type) {
        case 'gig_review':
          return '/admin/manage-gigs';
        case 'verification':
          return '/admin/users';
        case 'report':
          return '/admin/reports';
        default:
          return '/admin/dashboard';
      }
    }
    
    return '/';
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read in database
    try {
      await notificationsAPI.markAsRead(notification.id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isUnread: false } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
    
    // Navigate to the appropriate page
    const path = getNavigationPath(notification);
    if (path) {
      navigate(path);
    }
    
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationsAPI.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // If no user is logged in, don't render
  if (!user) {
    return null;
  }

  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="relative p-2 text-gray-600 hover:text-sky-600 transition-colors cursor-pointer"
        aria-label="Notifications"
        type="button"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                    notification.isUnread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.isUnread && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.time && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
