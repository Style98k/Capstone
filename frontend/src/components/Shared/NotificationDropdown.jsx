import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useLocalAuth';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('NotificationDropdown component mounted');
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    
    if (!user || user.role !== 'student') {
      console.log('Not a student user, showing login helper');
      return (
        <div className="relative">
          <button 
            onClick={() => {
              console.log('Auto-login as student for testing');
              const studentUser = {
                id: 'user_3',
                name: 'Maria Student',
                email: 'student@quickgig.test',
                role: 'student',
                schoolId: 'S-2024-001',
                verified: true,
                phone: '+63 912 345 6791',
                skills: ['Tutoring', 'Data Entry', 'Web Design'],
                experience: '2 years of tutoring experience',
                availability: 'Part-time',
                totalEarnings: 7500,
                rating: 4.5,
                totalRatings: 12,
                createdAt: '2024-01-03T00:00:00Z',
              };
              localStorage.setItem('quickgig_user', JSON.stringify(studentUser));
              window.location.reload();
            }}
            className="relative p-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          </button>
        </div>
      );
    }

    const storedNotifications = localStorage.getItem('userNotifications');
    
    if (!storedNotifications) {
      const dummyData = [
        { 
          id: 1, 
          type: 'application', 
          title: 'Application Accepted!', 
          message: 'Your application for Math Tutor was accepted', 
          time: '2 min ago', 
          isUnread: true 
        },
        { 
          id: 2, 
          type: 'gig', 
          title: 'New Gig Match', 
          message: 'A new tutoring gig matches your skills', 
          time: '1 hour ago', 
          isUnread: true 
        },
        { 
          id: 3, 
          type: 'payment', 
          title: 'Payment Received', 
          message: '₱500 was added to your wallet', 
          time: 'Yesterday', 
          isUnread: false 
        }
      ];
      localStorage.setItem('userNotifications', JSON.stringify(dummyData));
      setNotifications(dummyData);
    } else {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, [user]);

  // Temporarily disabled click-outside handler
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const handleNotificationClick = (notification) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, isUnread: false } : n
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    
    switch (notification.type) {
      case 'payment':
        navigate('/student/earnings');
        break;
      case 'application':
        navigate('/student/applications');
        break;
      case 'gig':
        navigate('/student/browse');
        break;
      default:
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          console.log('=== BELL CLICK DEBUG ===');
          console.log('Bell clicked, current isOpen:', isOpen);
          setIsOpen(!isOpen);
        }}
        onMouseDown={() => console.log('Mouse down on bell')}
        className="relative p-2 text-gray-600 hover:text-sky-600 transition-colors"
        style={{cursor: 'pointer'}}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {console.log('=== DROPDOWN RENDERING ===', 'isOpen:', isOpen)}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
               style={{zIndex: 9999, backgroundColor: 'red'}}
          >
          <div className="p-4 border-b border-gray-200">
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
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start">
                    {notification.isUnread && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-sm truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}
