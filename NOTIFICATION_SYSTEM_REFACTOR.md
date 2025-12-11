# Refactored Notification System - Complete Guide

## 📋 Overview

The notification system has been completely refactored to be **dynamic**, **role-based**, and **properly aligned**. It now uses a utility-first architecture that separates logic from UI.

## 🏗️ Architecture

### 1. **Notification Manager** (`src/utils/notificationManager.js`)
The brain of the system. Handles:
- Creating notifications
- Storing them in localStorage (role-specific)
- Dispatching events for real-time updates
- Managing read/unread status

### 2. **Navbar Notification Component** (`src/components/Layout/Navbar.jsx`)
The primary UI component. Features:
- Professional dropdown UI with proper alignment
- Real-time notification updates
- Smart routing based on notification type
- Dark mode support

### 3. **Universal Notification Bell** (`src/components/Shared/UniversalNotificationBell.jsx`)
Alternative component using the same logic
- Can be used in other layouts
- Same functionality as Navbar

## 💾 localStorage Structure

Notifications are stored per role:

```javascript
// For student notifications
localStorage.getItem('notifications_student')
// Returns: [
//   {
//     id: 1702300800000,
//     title: "Payment Received",
//     message: "You received ₱500 for your tutoring session",
//     type: "payment",
//     isUnread: true,
//     timestamp: "2024-12-11T10:00:00.000Z",
//     read: false
//   }
// ]

// Same pattern for 'notifications_client' and 'notifications_admin'
```

## 🚀 Usage

### Triggering Notifications from Any Component

```javascript
import { triggerNotification } from '../utils/notificationManager';

// In your component or API handler:
const handlePaymentSuccess = async (amount) => {
  triggerNotification(
    'student',              // target role
    'Payment Received',     // title
    `₱${amount} credited`, // message
    'payment'              // type (for routing)
  );
};
```

### Getting Notifications

```javascript
import { getNotifications, getUnreadCount } from '../utils/notificationManager';

// Get all notifications for a role
const studentNotifs = getNotifications('student');

// Get unread count (useful for badges)
const count = getUnreadCount('student'); // Returns: 3
```

### Marking as Read

```javascript
import { markNotificationAsRead } from '../utils/notificationManager';

markNotificationAsRead('student', notificationId);
```

## 📱 Notification Types & Routing

### Student Routes
| Type | Routes to |
|------|-----------|
| `payment` | `/student/earnings` |
| `application` | `/student/applications` |
| `gig` | `/student/browse` |

### Client Routes
| Type | Routes to |
|------|-----------|
| `application` | `/client/applicants` |
| `job_completed` | `/client/manage-gigs` |

### Admin Routes
| Type | Routes to |
|------|-----------|
| `verification` | `/admin/users` |
| `report` | `/admin/gigs` |

## 🎨 UI Features

### Dropdown Alignment
- ✅ Properly anchored to the right of the bell icon
- ✅ Maintains 80px width for readability
- ✅ Shadow and border styling for depth
- ✅ Smooth animations

### Typography
- Clean, readable font sizes
- Proper contrast in dark mode
- Truncated long messages (line-clamp)

### Interactions
- Click outside to close
- Click notification to mark as read & navigate
- Unread indicator (blue dot) appears only for unread items
- Badge shows only if unread count > 0

## 🔄 Event System

The system uses custom events to keep everything in sync:

```javascript
// Listen for notification updates anywhere
window.addEventListener('notificationUpdate', (event) => {
  console.log('Notification updated:', event.detail);
});

// Event detail structure:
{
  role: 'student',
  notification: { ... },
  type: 'marked_read' | 'new_notification' | 'cleared'
}
```

## 🔧 API Reference

### `triggerNotification(targetRole, title, message, type)`
Creates and stores a new notification.

**Parameters:**
- `targetRole` (string): 'student', 'client', or 'admin'
- `title` (string): Notification title
- `message` (string): Notification message
- `type` (string): Type for routing

**Returns:** boolean (success/failure)

**Example:**
```javascript
triggerNotification('admin', 'New Report', 'Spam report submitted', 'report');
```

---

### `getNotifications(role)`
Retrieves all notifications for a role.

**Parameters:**
- `role` (string): 'student', 'client', or 'admin'

**Returns:** Array of notification objects

**Example:**
```javascript
const notifications = getNotifications('student');
```

---

### `markNotificationAsRead(role, notificationId)`
Marks a notification as read.

**Parameters:**
- `role` (string): User role
- `notificationId` (number): Notification ID (timestamp)

**Returns:** boolean (success/failure)

**Example:**
```javascript
markNotificationAsRead('student', 1702300800000);
```

---

### `getUnreadCount(role)`
Gets the count of unread notifications.

**Parameters:**
- `role` (string): User role

**Returns:** number

**Example:**
```javascript
const count = getUnreadCount('admin'); // Returns: 3
```

---

### `clearNotifications(role)`
Removes all notifications for a role.

**Parameters:**
- `role` (string): User role

**Returns:** boolean (success/failure)

---

### `initializeSampleNotifications(role)`
Creates sample notifications if none exist (for testing).

**Parameters:**
- `role` (string): User role

**Example:**
```javascript
initializeSampleNotifications('student');
```

## 🧪 Testing

### Test Different User Roles

1. Login as **Student**
   - See: "Payment Received" notification
   - Click → Routes to `/student/earnings`

2. Logout and Login as **Client**
   - See: "New Applicant" notification
   - Click → Routes to `/client/applicants`

3. Logout and Login as **Admin**
   - See: "Pending ID Verification" notification
   - Click → Routes to `/admin/users`

### Test with Console

```javascript
// Add a new notification
triggerNotification('student', 'Test', 'Test message', 'payment');

// Check notifications
getNotifications('student');

// Check unread count
getUnreadCount('student'); // Should be 1 or 2

// Mark as read
markNotificationAsRead('student', Date.now());

// Check again
getUnreadCount('student'); // Should be less

// See badge disappear when count = 0
```

## 🎯 Best Practices

### Do ✅
- Use `triggerNotification()` to create notifications
- Use the provided routing types
- Listen to `notificationUpdate` events for custom logic
- Initialize sample data for testing

### Don't ❌
- Manually edit localStorage (always use the manager)
- Create notifications with invalid types
- Forget to dispatch events when updating

## 🚨 Common Issues

**Problem:** Bell badge doesn't disappear after reading
**Solution:** Make sure you're using `markNotificationAsRead()`, not manually updating state

**Problem:** Notifications show for wrong user
**Solution:** Verify the `targetRole` matches the user's actual role

**Problem:** Notification doesn't navigate
**Solution:** Check that the `type` matches one of the valid routing types

## 🔮 Future Enhancements

- [ ] Persist read/unread across sessions
- [ ] Add notification expiration (auto-delete after 30 days)
- [ ] Add notification categories/filtering
- [ ] Add sound notifications
- [ ] Add push notifications
- [ ] Add backend integration
- [ ] Add notification preferences/settings

## 📁 Files Modified

- `src/utils/notificationManager.js` - NEW (Utility functions)
- `src/components/Layout/Navbar.jsx` - Updated (Better UI & logic)
- `src/components/Shared/UniversalNotificationBell.jsx` - Updated (New logic)

## 💡 Key Improvements

1. **Separation of Concerns** - Logic in utils, UI in components
2. **DRY Principle** - No code duplication between components
3. **Scalability** - Easy to add new notification types
4. **Event-Driven** - Real-time updates without polling
5. **Role-Based** - Each user has their own notifications
6. **Professional UI** - Proper alignment, dark mode, animations
