# Universal Notification Bell - Testing Guide

## Issues Fixed
✅ Component now uses `useAuth` hook to get user role from `quickgig_user` localStorage
✅ Correct routes configured:
  - Client: `/client/applicants` (not `/client/view-applicants`)
  - Admin: `/admin/gigs` (not `/admin/content-moderation`)

## How to Test

### Step 1: Start the Dev Server
The server should already be running. Navigate to http://localhost:5173 (or 3001 if port 5173 is in use)

### Step 2: Login as a Test User

Open browser DevTools (F12) and check the Console. Use these test credentials:

**Student Login:**
- Email/School ID: `student@quickgig.test` or `S-2024-001`
- Password: `password`

**Client Login:**
- Email: `client@quickgig.test`
- Password: `password`

**Admin Login:**
- Email: `admin@quickgig.test`
- Password: `password`

### Step 3: Verify the Bell Icon Appears
After logging in, you should see:
- ✅ A bell icon in the top-right navbar (between nav links and user profile)
- ✅ A red badge with the number "1" (indicating 1 unread notification)

### Step 4: Click the Bell Icon
When you click the bell:
- ✅ A dropdown should appear
- ✅ You should see the role-specific dummy notification:

**For Students:**
```
Title: "Payment Received"
Message: "You received ₱500"
(Blue dot on the left = unread)
```

**For Clients:**
```
Title: "New Applicant"
Message: "Maria applied for Math Tutor"
(Blue dot on the left = unread)
```

**For Admins:**
```
Title: "Pending ID"
Message: "Carlos submitted an ID for review"
(Blue dot on the left = unread)
```

### Step 5: Click a Notification
When you click the notification:
- ✅ The dropdown should close
- ✅ You should be redirected to:

**Student:** `/student/earnings` (for payment notification)
**Client:** `/client/applicants` (for application notification)
**Admin:** `/admin/gigs` (for verification notification)

### Step 6: Verify Badge Updates
After clicking a notification:
- ✅ The red badge should disappear (no unread count)
- ✅ The blue dot should be gone when you reopen the dropdown
- ✅ The dropdown shows "No notifications" or the notification without the blue dot

---

## Troubleshooting

### Bell Icon Not Showing
**Problem:** Bell doesn't appear in navbar
**Solution:** 
1. Check DevTools console for errors
2. Make sure you're logged in (localStorage should have `quickgig_user`)
3. Refresh the page with Ctrl+F5 (hard refresh)

### Clicking Bell Does Nothing
**Problem:** Dropdown doesn't appear when clicking bell
**Solution:**
1. Open DevTools → Console
2. Check if there are any JavaScript errors
3. Verify user is logged in: `console.log(localStorage.getItem('quickgig_user'))`
4. Check if user role exists: `console.log(JSON.parse(localStorage.getItem('quickgig_user')).role)`

### Notification Click Doesn't Navigate
**Problem:** Clicking notification doesn't go to the expected page
**Solution:**
1. Check if the route exists in AppRouter.jsx
2. Verify the route paths in UniversalNotificationBell.jsx match the AppRouter
3. Check console for navigation errors

### Test Notifications Disappeared
**Problem:** Notifications cleared from dropdown
**Solution:**
1. Clear localStorage: `localStorage.removeItem('userNotifications')`
2. Refresh page: The dummy data will be regenerated based on your role

---

## Manual Console Testing

### Test as Student
```javascript
// Login as student (already logged in)
const notif = {
  id: Date.now(),
  type: 'payment',
  title: 'New Payment',
  message: '₱1500 payment received',
  isUnread: true
};
const existing = JSON.parse(localStorage.getItem('userNotifications') || '[]');
localStorage.setItem('userNotifications', JSON.stringify([notif, ...existing]));
// Refresh to see the new notification
location.reload();
```

### Test as Client
```javascript
const notif = {
  id: Date.now(),
  type: 'application',
  title: 'Maria Applied',
  message: 'New applicant for Web Developer',
  isUnread: true
};
const existing = JSON.parse(localStorage.getItem('userNotifications') || '[]');
localStorage.setItem('userNotifications', JSON.stringify([notif, ...existing]));
location.reload();
```

### Test as Admin
```javascript
const notif = {
  id: Date.now(),
  type: 'verification',
  title: 'ID Verification',
  message: 'User ID submitted for review',
  isUnread: true
};
const existing = JSON.parse(localStorage.getItem('userNotifications') || '[]');
localStorage.setItem('userNotifications', JSON.stringify([notif, ...existing]));
location.reload();
```

---

## Files Modified
- `frontend/src/components/Shared/UniversalNotificationBell.jsx` - Updated to use useAuth hook and correct routes
- `frontend/src/components/Shared/Navbar.jsx` - Already integrated the component

## Component Features
✅ Role-based notifications (student/client/admin)
✅ Smart navigation based on role AND notification type
✅ Unread count badge
✅ Blue dot for unread items
✅ Auto-close dropdown when clicking outside
✅ Persistent state in localStorage
✅ Dummy data generation based on role
