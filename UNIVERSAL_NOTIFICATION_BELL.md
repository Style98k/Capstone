# Universal Notification Bell Component

## Overview
The `UniversalNotificationBell` component is a role-based notification system that works seamlessly for Students, Clients, and Admins in QuickGig.

## Features
- ✅ **Role-Based Detection**: Automatically identifies user role from `localStorage.getItem('userRole')`
- ✅ **Smart Navigation**: Routes to different pages based on both role AND notification type
- ✅ **Role-Specific Dummy Data**: Generates sample notifications tailored to each user role
- ✅ **Unread Indicators**: 
  - Red badge showing unread count
  - Blue dot for individual unread notifications
- ✅ **Auto-Close**: Closes dropdown when clicking outside
- ✅ **Persistent State**: Stores notification state in localStorage

## Integration
The component is already integrated into the `Navbar.jsx` component. It appears between the navbar links and the user profile menu.

### Location in Navbar
```jsx
<UniversalNotificationBell />
```

## Storage Structure

### User Role
Stored in localStorage as:
```javascript
localStorage.setItem('userRole', 'student'); // 'student' | 'client' | 'admin'
```

### Notifications
Stored in localStorage as:
```javascript
localStorage.setItem('userNotifications', JSON.stringify([
  {
    id: 1,
    type: 'payment',           // Notification type (role-specific)
    title: 'Payment Received',  // Display title
    message: 'You received ₱500', // Description
    isUnread: true,            // Read status
    time: '2 min ago'          // (Optional) Time display
  }
]));
```

## Navigation Routes

### For STUDENT Role
| Notification Type | Route |
|---|---|
| `payment` | `/student/earnings` |
| `application` | `/student/applications` |
| `gig` | `/student/browse` |

### For CLIENT Role
| Notification Type | Route |
|---|---|
| `application` | `/client/view-applicants` |
| `job_completed` | `/client/manage-gigs` |

### For ADMIN Role
| Notification Type | Route |
|---|---|
| `verification` | `/admin/users` |
| `report` | `/admin/content-moderation` |

## Default Dummy Data

### Student Notifications
```javascript
[{ 
  id: 1, 
  type: 'payment', 
  title: 'Payment Received', 
  message: 'You received ₱500', 
  isUnread: true 
}]
```

### Client Notifications
```javascript
[{ 
  id: 1, 
  type: 'application', 
  title: 'New Applicant', 
  message: 'Maria applied for Math Tutor', 
  isUnread: true 
}]
```

### Admin Notifications
```javascript
[{ 
  id: 1, 
  type: 'verification', 
  title: 'Pending ID', 
  message: 'Carlos submitted an ID for review', 
  isUnread: true 
}]
```

## Adding New Notifications Programmatically

To add notifications from your backend or other components:

```javascript
// Example: Add a new notification
const newNotification = {
  id: Date.now(), // Use timestamp for unique ID
  type: 'payment', // Use appropriate type for user role
  title: 'New Payment',
  message: 'You received ₱1000',
  isUnread: true,
  time: 'Just now'
};

// Get existing notifications
const existing = JSON.parse(localStorage.getItem('userNotifications') || '[]');

// Add new notification
const updated = [newNotification, ...existing];

// Save back to localStorage
localStorage.setItem('userNotifications', JSON.stringify(updated));

// Optionally trigger a refresh (dispatch event or use context)
window.dispatchEvent(new Event('notificationsUpdated'));
```

## Customizing Notification Types

To add new notification types:

1. **Update the component's `getNavigationPath` function** in `UniversalNotificationBell.jsx`:

```javascript
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
      case 'NEW_TYPE': // Add your new type
        return '/path/to/page';
      default:
        return null;
    }
  }
  // ... similar for other roles
};
```

2. **Update dummy data in `useEffect`** if needed:

```javascript
if (role === 'student') {
  dummyData = [
    { 
      id: 1, 
      type: 'payment', 
      title: 'Payment Received', 
      message: 'You received ₱500', 
      isUnread: true 
    },
    // Add new dummy notification
    {
      id: 2,
      type: 'NEW_TYPE',
      title: 'New Feature',
      message: 'Description here',
      isUnread: true
    }
  ];
}
```

## Styling Customization

The component uses Tailwind CSS classes that can be modified:

- **Bell icon**: Modify the SVG or className
- **Badge color**: Change `bg-red-500` to your preferred color
- **Dropdown styling**: Adjust `w-80`, `max-h-96`, etc.
- **Unread indicator**: Change `bg-blue-500` dot styling
- **Hover effects**: Modify `hover:bg-gray-50` and `hover:text-sky-600`

## Testing the Component

### Manual Testing

1. Open browser DevTools Console
2. Set a user role:
   ```javascript
   localStorage.setItem('userRole', 'student');
   location.reload();
   ```

3. Add a test notification:
   ```javascript
   const notif = [{ id: 1, type: 'payment', title: 'Test', message: 'Test message', isUnread: true }];
   localStorage.setItem('userNotifications', JSON.stringify(notif));
   location.reload();
   ```

4. Click the bell icon to see the dropdown
5. Click a notification to test navigation

### Testing Different Roles

```javascript
// Test as student
localStorage.setItem('userRole', 'student');
location.reload();

// Test as client
localStorage.setItem('userRole', 'client');
location.reload();

// Test as admin
localStorage.setItem('userRole', 'admin');
location.reload();
```

## Files Modified
- `frontend/src/components/Shared/UniversalNotificationBell.jsx` - New component
- `frontend/src/components/Shared/Navbar.jsx` - Integrated the new component

## Future Enhancements

- [ ] Connect to backend API for real-time notifications
- [ ] Add sound/desktop notifications
- [ ] Add notification preferences/settings
- [ ] Add notification history/archive
- [ ] Add notification filtering by type
- [ ] Add real-time updates using WebSockets
