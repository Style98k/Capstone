import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useLocalAuth';
import { getNotifications, markNotificationAsRead, initializeSampleNotifications } from '../../utils/notificationManager';

export default function UniversalNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  // Get user role
  const userRole = user?.role;

  // Initialize user role and notifications
  useEffect(() => {
    if (!userRole) {
      setNotifications([]);
      return;
    }

    // Initialize sample notifications if none exist
    initializeSampleNotifications(userRole);
    
    // Load notifications for current user's role
    const roleNotifications = getNotifications(userRole);
    setNotifications(roleNotifications);
  }, [user?.id, userRole]);

  // Listen for notification updates
  useEffect(() => {
    const handleNotificationUpdate = (event) => {
      if (userRole) {
        const updated = getNotifications(userRole);
        setNotifications(updated);
      }
    };

    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    return () => window.removeEventListener('notificationUpdate', handleNotificationUpdate);
  }, [userRole]);

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
    const type = notification.type;
    
    if (userRole === 'student') {
      switch (type) {
        case 'payment':
          return '/student/earnings';
        case 'application':
          return '/student/applications';
        case 'gig':
          return '/student/browse';
        default:
          return null;
      }
    } else if (userRole === 'client') {
      switch (type) {
        case 'application':
          return '/client/applicants';
        case 'job_completed':
          return '/client/manage-gigs';
        default:
          return null;
      }
    } else if (userRole === 'admin') {
      switch (type) {
        case 'verification':
          return '/admin/users';
        case 'report':
          return '/admin/gigs';
        default:
          return null;
      }
    }
    
    return null;
  };

  const handleNotificationClick = (notification) => {
    // Mark as read using the notification manager
    markNotificationAsRead(userRole, notification.id);
    
    // Navigate to the appropriate page
    const path = getNavigationPath(notification);
    if (path) {
      navigate(path);
    }
    
    setIsOpen(false);
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
          console.log('Bell clicked, isOpen was:', isOpen, 'setting to:', !isOpen);
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
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    notification.isUnread ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.isUnread && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-sm truncate">
                        {notification.message}
                      </p>
                      {notification.time && (
                        <p className="text-xs text-gray-400 mt-1">
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
