# Quick Notification Reference

## How to Add Notifications Anywhere

### Import the Function
```javascript
import { triggerNotification } from '../../utils/notificationManager'
```

### Trigger a Notification
```javascript
triggerNotification(targetRole, title, message, type);
```

## Examples by Scenario

### Client Posts a Job
```javascript
// Notify admin to review the job
triggerNotification('admin', 'Job Review Needed', 'A client posted a new job. Please review it.', 'moderation');

// Notify all students of new opportunity
triggerNotification('student', 'New Job Alert', 'New job posted! It might be suited for you, check it out.', 'gig');
```

### Student Applies for Gig
```javascript
// Notify client of new applicant
triggerNotification('client', 'New Applicant', 'A student applied for your gig. Click to view details.', 'application');
```

### Student Verification Documents
```javascript
// Notify admin to review documents
triggerNotification('admin', 'Verification Request', 'A student submitted documents for verification.', 'verification');
```

### Client Makes Payment
```javascript
// Notify student of payment
triggerNotification('student', 'Payment Received', 'You received a payment! Check your wallet.', 'payment');
```

## Valid Target Roles
- `'admin'` - Administrator
- `'client'` - Client/Job Poster
- `'student'` - Student/Freelancer

## Valid Notification Types & Routes

| Type | Student Route | Client Route | Admin Route |
|------|---------------|--------------|-------------|
| `payment` | `/student/earnings` | - | - |
| `application` | `/student/applications` | `/client/applicants` | - |
| `gig` | `/student/browse` | - | - |
| `job_completed` | - | `/client/manage-gigs` | - |
| `verification` | - | - | `/admin/users` |
| `moderation` | - | - | `/admin/gigs` |
| `report` | - | - | `/admin/gigs` |

## localStorage Structure
```
notifications_admin: [
  {
    id: 1702290000000,
    title: "Job Review Needed",
    message: "A client posted a new job. Please review it.",
    type: "moderation",
    isUnread: true,
    timestamp: "2024-12-11T10:00:00.000Z"
  },
  ...
]

notifications_client: [
  {
    id: 1702290001000,
    title: "New Applicant",
    message: "A student applied for your gig. Click to view details.",
    type: "application",
    isUnread: true,
    timestamp: "2024-12-11T10:05:00.000Z"
  },
  ...
]

notifications_student: [
  {
    id: 1702290002000,
    title: "New Job Alert",
    message: "New job posted! It might be suited for you, check it out.",
    type: "gig",
    isUnread: true,
    timestamp: "2024-12-11T10:10:00.000Z"
  },
  ...
]
```

## Testing Commands in Browser Console

```javascript
// Trigger admin notification
triggerNotification('admin', 'Test Notification', 'This is a test', 'moderation');

// View admin notifications
JSON.parse(localStorage.getItem('notifications_admin'))

// Clear admin notifications
localStorage.setItem('notifications_admin', '[]')

// Trigger all roles at once
triggerNotification('admin', 'Test', 'Test message', 'moderation');
triggerNotification('client', 'Test', 'Test message', 'application');
triggerNotification('student', 'Test', 'Test message', 'gig');
```

## Current Implementation Status

✅ **Files Modified:**
- `frontend/src/pages/client/PostGig.jsx` - Triggers admin + student notifications
- `frontend/src/pages/GigDetails.jsx` - Triggers client notification on apply
- `frontend/src/pages/student/ProfileManagement.jsx` - Triggers admin notification on verification
- `frontend/src/pages/client/Payments.jsx` - Triggers student notification on payment

✅ **Notification Manager:**
- `frontend/src/utils/notificationManager.js` - Core utility (already exists)

✅ **UI Components:**
- `frontend/src/components/Layout/Navbar.jsx` - Bell icon + dropdown (already updated)

## Notes
- Notifications are stored per-role in localStorage
- Navbar automatically listens for notification updates via custom events
- Each notification is unique (ID = timestamp)
- Clicking a notification navigates to the appropriate page based on role + type
- All notifications are marked as `isUnread: true` initially
