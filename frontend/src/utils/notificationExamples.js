/**
 * Example: How to trigger notifications from anywhere in your application
 * 
 * This is NOT a component, but shows how to use the notificationManager
 */

import { triggerNotification, getNotifications, getUnreadCount } from '../utils/notificationManager';

/**
 * Example 1: Trigger a notification for a student
 * This would be called from a payment service, API response, etc.
 */
export const exampleTriggerStudentPaymentNotification = () => {
  triggerNotification(
    'student',
    'Payment Received',
    'You received ₱1,500 for your tutoring session',
    'payment'
  );
};

/**
 * Example 2: Trigger a notification for a client
 * This would be called when someone applies for their gig
 */
export const exampleTriggerClientApplicationNotification = () => {
  triggerNotification(
    'client',
    'New Applicant Applied',
    'John applied for Web Development - Freelance Project',
    'application'
  );
};

/**
 * Example 3: Trigger a notification for an admin
 * This would be called when content needs moderation
 */
export const exampleTriggerAdminReportNotification = () => {
  triggerNotification(
    'admin',
    'New User Report',
    'Report submitted for user behavior violation',
    'report'
  );
};

/**
 * Example 4: Get notifications for a role
 */
export const exampleGetNotifications = (role) => {
  const notifications = getNotifications(role);
  console.log(`Notifications for ${role}:`, notifications);
  return notifications;
};

/**
 * Example 5: Get unread count (useful for badges)
 */
export const exampleGetUnreadCount = (role) => {
  const count = getUnreadCount(role);
  console.log(`Unread count for ${role}:`, count);
  return count;
};

/**
 * USAGE IN YOUR COMPONENTS:
 * 
 * import { triggerNotification } from '../utils/notificationManager';
 * 
 * // In an async function or useEffect:
 * const handlePaymentSuccess = async () => {
 *   const response = await processPayment();
 *   if (response.success) {
 *     triggerNotification(
 *       'student',
 *       'Payment Successful',
 *       `₱${response.amount} has been transferred to your account`,
 *       'payment'
 *     );
 *   }
 * };
 */

/**
 * NOTIFICATION TYPES REFERENCE:
 * 
 * For Students:
 * - 'payment' -> /student/earnings
 * - 'application' -> /student/applications
 * - 'gig' -> /student/browse
 * 
 * For Clients:
 * - 'application' -> /client/applicants
 * - 'job_completed' -> /client/manage-gigs
 * 
 * For Admins:
 * - 'verification' -> /admin/users
 * - 'report' -> /admin/gigs
 */
