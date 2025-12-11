# 🧪 Notification System - Quick Test Guide

## ✅ What's New

Your notification system has been completely refactored:

1. **Dynamic** - Notifications are created on-demand, not hardcoded
2. **Role-Based** - Each user (student/client/admin) has separate notifications
3. **Professional UI** - Properly aligned dropdown with clean typography
4. **Event-Driven** - Real-time updates across components
5. **Easy to Use** - Simple API for creating notifications from anywhere

---

## 🚀 Quick Start

### Step 1: Test the Default Notifications

1. Open your app at `localhost:5173` (or your port)
2. Login as **Admin**
   - You should see the bell icon with a red "1" badge
   - Click the bell to see "Pending ID Verification" notification
3. Click the notification
   - Badge disappears (marked as read)
   - Navigates to `/admin/users`
4. Go back to home
   - Badge is still gone (state preserved)

### Step 2: Test User Switching

1. Logout from the navbar
2. Login as **Student**
   - Bell shows red "1" again (fresh notification)
   - Message: "Payment Received"
3. Logout and login as **Client**
   - Bell shows red "1" again
   - Message: "New Applicant"

---

## 💻 Console Testing

Open DevTools (F12) → Console and try these:

### Create a Notification (While logged in)

```javascript
import { triggerNotification } from './utils/notificationManager.js';

// Add a new notification
triggerNotification('student', 'New Gig Posted', 'Physics tutoring gig now available', 'gig');
```

The bell should now show "2" and the dropdown will include the new notification!

### Get All Notifications

```javascript
import { getNotifications } from './utils/notificationManager.js';

getNotifications('student');
// Returns: [{ id: 1702300800000, title: "Payment Received", ... }, ...]
```

### Check Unread Count

```javascript
import { getUnreadCount } from './utils/notificationManager.js';

getUnreadCount('admin'); // Returns: 1, 2, 3, etc.
```

### Mark as Read

```javascript
import { markNotificationAsRead } from './utils/notificationManager.js';

// Get a notification ID first
const notifs = getNotifications('student');
const notifId = notifs[0].id;

// Mark it as read
markNotificationAsRead('student', notifId);

// The badge should update automatically!
```

---

## 📋 Test Checklist

- [ ] Login as each role (student, client, admin)
- [ ] See the correct dummy notification for that role
- [ ] Click the notification
  - [ ] Notification marked as read (blue dot disappears)
  - [ ] Badge "1" disappears
  - [ ] Routed to correct page
- [ ] Navigate away and back
  - [ ] Badge stays gone (state preserved)
- [ ] Logout and switch users
  - [ ] Fresh notifications load for new user
  - [ ] Previous user's read state is preserved
- [ ] Use console to trigger new notifications
  - [ ] Notification appears in dropdown immediately
  - [ ] Badge count updates correctly

---

## 🎯 Notification Types Reference

### For Students
- `payment` → Salary received → `/student/earnings`
- `application` → Application status → `/student/applications`
- `gig` → New gig match → `/student/browse`

### For Clients
- `application` → Someone applied → `/client/applicants`
- `job_completed` → Gig finished → `/client/manage-gigs`

### For Admins
- `verification` → ID to review → `/admin/users`
- `report` → Content report → `/admin/gigs`

---

## 💡 Real-World Examples

### Example 1: Trigger notification when payment succeeds

```javascript
// In your payment handler (e.g., PaymentModal.jsx)
import { triggerNotification } from '../utils/notificationManager';

const handlePaymentSuccess = async (amount) => {
  // Process payment with backend
  const response = await processPaymentAPI(amount);
  
  if (response.success) {
    // Notify the student
    triggerNotification(
      'student',
      'Payment Received! 💰',
      `₱${amount.toFixed(2)} has been credited to your account`,
      'payment'
    );
  }
};
```

### Example 2: Trigger when someone applies

```javascript
// In your application handler (e.g., ViewApplicants.jsx)
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

### Example 3: Trigger admin notification

```javascript
// In your moderation handler (e.g., admin panel)
import { triggerNotification } from '../utils/notificationManager';

const handleContentReport = (reportType, reportCount) => {
  triggerNotification(
    'admin',
    'Content Report Received 🚩',
    `${reportCount} reports submitted for review`,
    'report'
  );
};
```

---

## 🔍 Debugging

### Check localStorage structure

```javascript
// View all notifications for a role
Object.keys(localStorage).filter(k => k.includes('notifications_'));
// Output: ['notifications_student', 'notifications_client', 'notifications_admin']

// View specific role's notifications
JSON.parse(localStorage.getItem('notifications_admin'));
```

### Check if event is firing

```javascript
window.addEventListener('notificationUpdate', (event) => {
  console.log('Notification update received:', event.detail);
});

// Now trigger a notification - you should see the log
```

---

## 📁 Key Files

- `src/utils/notificationManager.js` - All the logic
- `src/components/Layout/Navbar.jsx` - Main UI component
- `src/components/Shared/UniversalNotificationBell.jsx` - Alternative component

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Bell shows no badge | Login as a user and refresh the page |
| Notification doesn't disappear when clicked | Check browser console for errors |
| Wrong notification appears for user | Verify `targetRole` matches user's actual role |
| Dropdown doesn't close | Click outside the dropdown or press Esc |

---

## 🎉 You're All Set!

The notification system is now:
- ✅ Dynamic and role-based
- ✅ Properly aligned and styled
- ✅ Easy to use from anywhere
- ✅ Production-ready

Start using `triggerNotification()` to create notifications throughout your app! 🚀
