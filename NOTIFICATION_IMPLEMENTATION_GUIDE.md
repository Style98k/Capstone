# 📚 Notification System - Complete Implementation Guide

## 🎯 Overview

Your notification system is now completely refactored with three components:

1. **Utility Layer** - `notificationManager.js` (logic)
2. **UI Layer** - `Navbar.jsx` & `UniversalNotificationBell.jsx` (components)
3. **Integration** - Use anywhere via `triggerNotification()`

---

## 📦 Core Utility: notificationManager.js

### Main Function: triggerNotification()

```javascript
triggerNotification(targetRole, title, message, type)

// Example:
triggerNotification('student', 'Payment Received', 'You got ₱500', 'payment');

// Returns: true/false (success/failure)
```

**Parameters:**
- `targetRole` - 'student' | 'client' | 'admin'
- `title` - Short notification title
- `message` - Longer description
- `type` - For routing (see table below)

**What it does:**
1. Validates inputs
2. Gets existing notifications from localStorage
3. Creates new notification object with id, timestamp, etc.
4. Saves to `notifications_${role}` in localStorage
5. Dispatches `notificationUpdate` event for real-time UI updates

---

### Helper Functions

#### getNotifications(role)
```javascript
const notifs = getNotifications('student');
// Returns: [ { id, title, message, type, isUnread, timestamp }, ... ]
```

#### markNotificationAsRead(role, notificationId)
```javascript
markNotificationAsRead('student', 1702300800000);
// Returns: boolean
// Also dispatches notificationUpdate event
```

#### getUnreadCount(role)
```javascript
const count = getUnreadCount('admin');
// Returns: number
// Useful for badge display
```

#### clearNotifications(role)
```javascript
clearNotifications('student');
// Removes all notifications for that role
```

#### initializeSampleNotifications(role)
```javascript
initializeSampleNotifications('student');
// Creates sample notifications if none exist
// Useful for testing and onboarding
```

---

## 🎨 UI Component: Navbar.jsx

### Component Structure

```jsx
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const notificationsRef = useRef(null)

  // Initialize notifications when user logs in
  useEffect(() => {
    if (!user?.role) return
    initializeSampleNotifications(user.role)
    const roleNotifications = getNotifications(user.role)
    setNotifications(roleNotifications)
  }, [user?.role])

  // Listen for notification updates
  useEffect(() => {
    const handleNotificationUpdate = (event) => {
      if (user?.role) {
        const updated = getNotifications(user.role)
        setNotifications(updated)
      }
    }

    window.addEventListener('notificationUpdate', handleNotificationUpdate)
    return () => window.removeEventListener('notificationUpdate', handleNotificationUpdate)
  }, [user?.role])

  // ... rest of component
}
```

### Key Features

1. **On Mount**: Load user's role-specific notifications
2. **Real-Time**: Listen for `notificationUpdate` events
3. **Auto-Update**: When notifications change, UI updates immediately
4. **Clean Up**: Remove event listeners on unmount

---

## 🔀 Routing Logic

### Navigation Path Determination

```javascript
const getNavigationPath = (notification) => {
  const type = notification.type;
  
  if (user?.role === 'student') {
    switch (type) {
      case 'payment': return '/student/earnings';
      case 'application': return '/student/applications';
      case 'gig': return '/student/browse';
      default: return null;
    }
  } else if (user?.role === 'client') {
    switch (type) {
      case 'application': return '/client/applicants';
      case 'job_completed': return '/client/manage-gigs';
      default: return null;
    }
  } else if (user?.role === 'admin') {
    switch (type) {
      case 'verification': return '/admin/users';
      case 'report': return '/admin/gigs';
      default: return null;
    }
  }
  return null;
};
```

---

## 🖱️ Click Handler

```javascript
const handleNotificationClick = (notification) => {
  // Mark as read using notification manager
  markNotificationAsRead(user?.role, notification.id);
  
  // Navigate to appropriate page
  const path = getNavigationPath(notification);
  if (path) {
    navigate(path);
  }
  
  // Close dropdown
  setNotificationsOpen(false);
};
```

**Flow:**
1. User clicks notification
2. Handler marks it as read in localStorage
3. Event dispatched → UI updates (blue dot disappears)
4. Navigate to appropriate page
5. Close dropdown

---

## 🎨 UI Layout

### Bell Icon with Badge

```jsx
<button
  onClick={(e) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
  }}
  className={iconButtonStyles}
>
  <svg className="w-5 h-5..." fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* Bell icon SVG */}
  </svg>
  {unreadCount > 0 && (
    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs 
      rounded-full h-5 w-5 flex items-center justify-center font-bold">
      {unreadCount}
    </span>
  )}
</button>
```

**Key Points:**
- Badge only shows if `unreadCount > 0`
- Positioned at top-right of icon
- Red background for visibility
- Bold font for readability

---

### Dropdown Menu

```jsx
{notificationsOpen && (
  <div 
    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 
      shadow-xl rounded-lg z-50 border border-gray-100 dark:border-gray-700 overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 
      bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-gray-750 dark:to-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white text-base">
        Notifications
      </h3>
    </div>

    {/* Content */}
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 
                cursor-pointer transition-colors flex items-start gap-3 ${
                notification.isUnread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              {/* Unread indicator */}
              {notification.isUnread && (
                <div className="flex-shrink-0 mt-1.5">
                  <div className="h-2.5 w-2.5 bg-blue-500 rounded-full"></div>
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white 
                  text-sm leading-tight">
                  {notification.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs 
                  mt-1 line-clamp-2">
                  {notification.message}
                </p>
                {notification.timestamp && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
```

**Layout Features:**
- Header with gradient background
- Scrollable content (max-height)
- Unread indicator (blue dot)
- Message truncation (line-clamp-2)
- Timestamp display
- Hover effects
- Dark mode colors

---

## 💾 localStorage Structure

### Storage Pattern

```javascript
// Each role has its own key
localStorage.getItem('notifications_student')
localStorage.getItem('notifications_client')
localStorage.getItem('notifications_admin')
```

### Data Structure

```json
[
  {
    "id": 1702300800000,
    "title": "Payment Received",
    "message": "You received ₱500 for your tutoring session",
    "type": "payment",
    "isUnread": true,
    "read": false,
    "timestamp": "2024-12-11T10:00:00.000Z"
  },
  {
    "id": 1702300900000,
    "title": "Application Status",
    "message": "Your application was accepted!",
    "type": "application",
    "isUnread": false,
    "read": true,
    "timestamp": "2024-12-11T10:05:00.000Z"
  }
]
```

---

## 🔄 Event System

### Dispatch Events

The utility dispatches custom events when notifications change:

```javascript
window.dispatchEvent(
  new CustomEvent('notificationUpdate', {
    detail: { 
      role: targetRole, 
      notification: newNotification,
      type: 'new_notification' 
    }
  })
);
```

### Listen for Updates

In any component:

```javascript
useEffect(() => {
  const handleUpdate = (event) => {
    console.log('Notification updated:', event.detail);
    // Update UI
  };

  window.addEventListener('notificationUpdate', handleUpdate);
  return () => window.removeEventListener('notificationUpdate', handleUpdate);
}, []);
```

---

## 🚀 Integration Examples

### Example 1: Create Notification on Payment

```javascript
// In payment handler
import { triggerNotification } from '../utils/notificationManager';

const handlePaymentSuccess = async (amount) => {
  const response = await processPayment(amount);
  
  if (response.success) {
    triggerNotification(
      'student',
      'Payment Received! 💰',
      `₱${amount.toFixed(2)} has been credited to your account`,
      'payment'
    );
  }
};
```

### Example 2: Create Notification on Application

```javascript
// In application handler
import { triggerNotification } from '../utils/notificationManager';

const handleNewApplication = (applicantName, gigTitle) => {
  triggerNotification(
    'client',
    'New Applicant! 👤',
    `${applicantName} applied for "${gigTitle}"`,
    'application'
  );
};
```

### Example 3: Create Notification on Report

```javascript
// In moderation handler
import { triggerNotification } from '../utils/notificationManager';

const handleContentReport = (reportType) => {
  triggerNotification(
    'admin',
    'Content Report Received 🚩',
    `New ${reportType} report submitted for review`,
    'report'
  );
};
```

---

## ✅ Notification Types Reference

### Student Types
| Type | Destination | Example |
|------|------------|---------|
| `payment` | `/student/earnings` | Salary received |
| `application` | `/student/applications` | Application status |
| `gig` | `/student/browse` | New gig match |

### Client Types
| Type | Destination | Example |
|------|------------|---------|
| `application` | `/client/applicants` | Someone applied |
| `job_completed` | `/client/manage-gigs` | Gig finished |

### Admin Types
| Type | Destination | Example |
|------|------------|---------|
| `verification` | `/admin/users` | ID to review |
| `report` | `/admin/gigs` | Content report |

---

## 🧪 Testing Code

```javascript
// Test in browser console

// 1. Trigger a notification
triggerNotification('student', 'Test Payment', 'Test ₱100', 'payment');

// 2. Check notifications
getNotifications('student');

// 3. Check unread count
getUnreadCount('student'); // Should be 1 or 2

// 4. Mark as read
const notifs = getNotifications('student');
markNotificationAsRead('student', notifs[0].id);

// 5. Check count again
getUnreadCount('student'); // Should decrease

// 6. Listen for events
window.addEventListener('notificationUpdate', console.log);

// 7. Trigger another notification
triggerNotification('student', 'Test 2', 'Another test', 'gig');
// Should log the event
```

---

## 🎯 Summary

Your notification system is now:

1. **Dynamic** - Create notifications anytime, anywhere
2. **Role-Based** - Each user has separate notifications
3. **Real-Time** - Instant UI updates via events
4. **Professional** - Polished UI with proper alignment
5. **Scalable** - Easy to add new types
6. **Production-Ready** - Error handling and validation included

Start using `triggerNotification()` to integrate notifications throughout your app!

---

## 📞 Quick Reference

```javascript
// Import
import { 
  triggerNotification, 
  getNotifications, 
  markNotificationAsRead,
  getUnreadCount 
} from '../utils/notificationManager';

// Create
triggerNotification(role, title, message, type);

// Read
getNotifications(role);

// Update
markNotificationAsRead(role, notificationId);

// Count
getUnreadCount(role);
```

That's it! You're ready to use the notification system. 🚀
