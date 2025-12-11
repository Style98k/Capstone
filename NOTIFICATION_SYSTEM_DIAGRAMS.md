# Notification System Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   ROLE-SPECIFIC NOTIFICATION SYSTEM              │
└─────────────────────────────────────────────────────────────────┘

                        ┌──────────────────────┐
                        │  triggerNotification │
                        │ (Core Utility Func)  │
                        └──────┬───────────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
           ┌──────▼───────┐         ┌──────▼───────┐
           │ Create Object │         │ Save to Stor │
           │   {id, title, │         │ notifications│
           │   message...} │         │  _{role}     │
           └──────┬───────┘         └──────┬───────┘
                  │                        │
                  └────────────┬───────────┘
                               │
                       ┌───────▼────────┐
                       │Dispatch Custom │
                       │Event:          │
                       │notificationUpda│
                       │te              │
                       └───────┬────────┘
                               │
                       ┌───────▼──────────┐
                       │Navbar.jsx        │
                       │Listens & Displays│
                       │in Bell Icon      │
                       └──────────────────┘
```

---

## Data Flow: Posting a Job

```
Client Posts Job
      │
      ▼
PostGig.jsx
handleSubmit()
      │
      ├─► saveGig() → Success?
      │         │
      │         ├─► ✓ Yes
      │         │      │
      │         │      ▼
      │         │   triggerNotification('admin', ...)
      │         │      │
      │         │      ▼
      │         │   localStorage.setItem('notifications_admin', [...])
      │         │      │
      │         │      ▼
      │         │   dispatchEvent('notificationUpdate')
      │         │      │
      │         │      ▼
      │         │   Navbar.jsx listens
      │         │      │
      │         │      ▼
      │         │   Admin sees bell notification
      │         │
      │         └─► triggerNotification('student', ...)
      │                │
      │                ▼
      │            localStorage.setItem('notifications_student', [...])
      │                │
      │                ▼
      │            dispatchEvent('notificationUpdate')
      │                │
      │                ▼
      │            All logged-in Students see bell notification
      │
      ├─► ✗ No
      │      │
      │      ▼
      │   Show error alert
      │
      ▼
navigate('/client/manage-gigs')
```

---

## Data Flow: Student Applying for Gig

```
Student Applies
      │
      ▼
GigDetails.jsx
handleApply()
      │
      ├─► saveApplication() → Success?
      │         │
      │         ├─► ✓ Yes
      │         │      │
      │         │      ▼
      │         │   triggerNotification('client', ...)
      │         │      │
      │         │      ▼
      │         │   localStorage.setItem('notifications_client', [...])
      │         │      │
      │         │      ▼
      │         │   dispatchEvent('notificationUpdate')
      │         │      │
      │         │      ▼
      │         │   Navbar.jsx listens (if client is logged in)
      │         │      │
      │         │      ▼
      │         │   Client (gig owner) sees bell notification
      │         │
      │         └─► Show success message
      │         │
      │         └─► window.location.reload()
      │
      ├─► ✗ No
      │      │
      │      ▼
      │   Show error alert
      │
      ▼
(Application submitted)
```

---

## Data Flow: Student Verification Upload

```
Student Uploads ID/Assessment
          │
          ▼
ProfileManagement.jsx
handleVerifySubmit() or
handleAssessmentSubmit()
          │
          ├─► File validation → Success?
          │         │
          │         ├─► ✓ Yes
          │         │      │
          │         │      ▼
          │         │   localStorage.setItem('verificationStatus', 'pending')
          │         │      │
          │         │      ▼
          │         │   triggerNotification('admin', ...)
          │         │      │
          │         │      ▼
          │         │   localStorage.setItem('notifications_admin', [...])
          │         │      │
          │         │      ▼
          │         │   dispatchEvent('notificationUpdate')
          │         │      │
          │         │      ▼
          │         │   Navbar.jsx listens (if admin is logged in)
          │         │      │
          │         │      ▼
          │         │   Admin sees bell notification
          │         │
          │         └─► Show success toast
          │
          ├─► ✗ No
          │      │
          │      ▼
          │   Show error toast
          │
          ▼
(File upload complete)
```

---

## Data Flow: Payment Processing

```
Client Makes Payment
      │
      ▼
Payments.jsx
handlePaymentSuccess()
      │
      ├─► Payment processing → Success?
      │         │
      │         ├─► ✓ Yes
      │         │      │
      │         │      ▼
      │         │   triggerNotification('student', ...)
      │         │      │
      │         │      ▼
      │         │   localStorage.setItem('notifications_student', [...])
      │         │      │
      │         │      ▼
      │         │   dispatchEvent('notificationUpdate')
      │         │      │
      │         │      ▼
      │         │   Navbar.jsx listens (if student is logged in)
      │         │      │
      │         │      ▼
      │         │   Student sees bell notification
      │         │
      │         └─► Show success alert
      │         │
      │         └─► Clear payment modal
      │
      ├─► ✗ No
      │      │
      │      ▼
      │   Show error alert
      │
      ▼
(Payment complete)
```

---

## Notification Bell UI Flow

```
Navbar.jsx mounts
      │
      ▼
useEffect: Load notifications
      │
      ├─► Get user.role from useAuth()
      │
      ├─► Read from localStorage:
      │   notifications_${user.role}
      │
      ├─► Parse JSON array
      │
      └─► Set to state
          │
          ▼
useEffect: Listen for updates
      │
      ├─► window.addEventListener('notificationUpdate')
      │
      └─► When event fires:
          ├─► Get fresh notifications
          ├─► Update component state
          └─► Re-render with new notifications
              │
              ▼
          Badge shows:
          ├─► Unread count > 0 → Red badge with number
          └─► Unread count = 0 → Blue dot (empty badge)
              │
              ▼
          User clicks notification
              │
              ├─► Get notification type & user role
              ├─► getNavigationPath(notification)
              ├─► markNotificationAsRead()
              ├─► navigate(path)
              └─► Close dropdown
```

---

## Storage Structure Timeline

```
INITIAL STATE:
┌────────────────────────────────────────┐
│ localStorage.getItem('notifications_*') │
│ Returns: null or []                     │
└────────────────────────────────────────┘

AFTER CLIENT POSTS JOB:
┌─────────────────────────────────────────────────────────────────────┐
│ notifications_admin = [                                              │
│   {id: 1702290000000, title: "Job Review Needed", type: "moderation"│
│    isUnread: true, timestamp: "2024-12-11T10:00:00.000Z"}            │
│ ]                                                                    │
│                                                                      │
│ notifications_student = [                                            │
│   {id: 1702290000001, title: "New Job Alert", type: "gig"           │
│    isUnread: true, timestamp: "2024-12-11T10:00:01.000Z"}            │
│ ]                                                                    │
│                                                                      │
│ notifications_client = [] (unchanged)                                │
└─────────────────────────────────────────────────────────────────────┘

AFTER STUDENT APPLIES:
┌─────────────────────────────────────────────────────────────────────┐
│ notifications_client = [                                             │
│   {id: 1702290005000, title: "New Applicant", type: "application"   │
│    isUnread: true, timestamp: "2024-12-11T10:05:00.000Z"}            │
│ ]                                                                    │
│                                                                      │
│ notifications_admin = [...] (unchanged)                              │
│ notifications_student = [...] (unchanged)                            │
└─────────────────────────────────────────────────────────────────────┘

AFTER STUDENT UPLOADS VERIFICATION:
┌─────────────────────────────────────────────────────────────────────┐
│ notifications_admin = [                                              │
│   {id: 1702290010000, title: "Verification Request", ...},           │
│   {id: 1702290000000, title: "Job Review Needed", ...} (older)       │
│ ]                                                                    │
│                                                                      │
│ notifications_client = [...] (unchanged)                             │
│ notifications_student = [...] (unchanged)                            │
└─────────────────────────────────────────────────────────────────────┘

AFTER CLIENT MAKES PAYMENT:
┌─────────────────────────────────────────────────────────────────────┐
│ notifications_student = [                                            │
│   {id: 1702290015000, title: "Payment Received", type: "payment"    │
│    isUnread: true, timestamp: "2024-12-11T10:15:00.000Z"},           │
│   {id: 1702290000001, title: "New Job Alert", ...} (older)           │
│ ]                                                                    │
│                                                                      │
│ notifications_admin = [...] (unchanged)                              │
│ notifications_client = [...] (unchanged)                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Notification Type → Navigation Route Mapping

```
STUDENT ROLE:
├─ Type: 'payment' ──────────► Route: /student/earnings
├─ Type: 'application' ──────► Route: /student/applications
├─ Type: 'gig' ──────────────► Route: /student/browse
└─ Type: 'verification' ─────► No navigation (info only)

CLIENT ROLE:
├─ Type: 'application' ──────► Route: /client/applicants
├─ Type: 'job_completed' ────► Route: /client/manage-gigs
└─ Type: 'moderation' ───────► No navigation (info only)

ADMIN ROLE:
├─ Type: 'verification' ─────► Route: /admin/users
├─ Type: 'moderation' ───────► Route: /admin/gigs
└─ Type: 'report' ──────────► Route: /admin/gigs
```

---

## Role-Role Notification Matrix

```
                SENDS TO      SENDS TO      SENDS TO
                ADMIN         CLIENT        STUDENT
CLIENT          ──────        APPLIES       POST JOB
(Posts Job)     Reviews       Applies       New Opportunity
                Gig           Application   Available

STUDENT         VERIFIES      ──────        ──────
(Uploads ID)    Documents     (N/A)         (N/A)
                Submitted

STUDENT         ──────        ──────        ──────
(Applies)       APPLICANT!    New Candidate (N/A)
                New Apply     Applied

CLIENT          ──────        ──────        PAYMENT!
(Makes Payment) (N/A)         (N/A)         Money Received
```

---

## Component Trigger Points

```
┌─────────────────────────────────────────────────────────────────┐
│                     FILE: PostGig.jsx                           │
├─────────────────────────────────────────────────────────────────┤
│ Location: handleSubmit() function                                │
│ When: After saveGig() succeeds                                   │
│ Triggers:                                                        │
│ ✓ triggerNotification('admin', 'Job Review Needed', ..., 'mod')  │
│ ✓ triggerNotification('student', 'New Job Alert', ..., 'gig')    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     FILE: GigDetails.jsx                        │
├─────────────────────────────────────────────────────────────────┤
│ Location: handleApply() function                                 │
│ When: After saveApplication() succeeds                           │
│ Triggers:                                                        │
│ ✓ triggerNotification('client', 'New Applicant', ..., 'app')     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   FILE: ProfileManagement.jsx                   │
├─────────────────────────────────────────────────────────────────┤
│ Location: handleVerifySubmit() AND handleAssessmentSubmit()      │
│ When: After file validation succeeds                             │
│ Triggers:                                                        │
│ ✓ triggerNotification('admin', 'Verification Request', ..., 'v')│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     FILE: Payments.jsx                          │
├─────────────────────────────────────────────────────────────────┤
│ Location: handlePaymentSuccess() function                        │
│ When: After payment processes successfully                       │
│ Triggers:                                                        │
│ ✓ triggerNotification('student', 'Payment Received', ..., 'pay') │
└─────────────────────────────────────────────────────────────────┘
```

---

**Diagram Created:** December 11, 2025
**System Status:** ✅ FULLY IMPLEMENTED
