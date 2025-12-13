import db from "../config/db.js";

const Notifications = {
  // get notifications for a user
  getByUser: (userId, callback) => {
    db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
      callback
    );
  },

  // get notifications by role (for admin, all students, all clients)
  getByRole: (role, callback) => {
    db.query(
      `SELECT n.* FROM notifications n 
       JOIN users u ON n.user_id = u.id 
       WHERE u.role = ? 
       ORDER BY n.created_at DESC`,
      [role],
      callback
    );
  },

  // create notification for a specific user
  create: (data, callback) => {
    db.query(
      `INSERT INTO notifications (user_id, title, message, type, link, is_read)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.title || 'Notification',
        data.message,
        data.type || 'general',
        data.link || "",
        data.is_read || 0
      ],
      callback
    );
  },

  // create notification for all users of a specific role
  createForRole: (role, data, callback) => {
    // Get all users with this role
    db.query(
      "SELECT id FROM users WHERE role = ?",
      [role],
      (err, users) => {
        if (err) return callback(err);
        
        if (users.length === 0) return callback(null, { insertId: 0 });
        
        // Create notification for each user
        const values = users.map(u => [
          u.id,
          data.title || 'Notification',
          data.message,
          data.type || 'general',
          data.link || '',
          0
        ]);
        
        const sql = `INSERT INTO notifications (user_id, title, message, type, link, is_read) VALUES ?`;
        db.query(sql, [values], callback);
      }
    );
  },

  // mark notification as read
  markAsRead: (id, callback) => {
    db.query(
      "UPDATE notifications SET is_read = 1 WHERE id = ?",
      [id],
      callback
    );
  },

  // mark all notifications as read for a user
  markAllAsRead: (userId, callback) => {
    db.query(
      "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
      [userId],
      callback
    );
  },

  // delete notification
  delete: (id, callback) => {
    db.query("DELETE FROM notifications WHERE id = ?", [id], callback);
  },

  // get unread count for a user
  getUnreadCount: (userId, callback) => {
    db.query(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0",
      [userId],
      callback
    );
  }
};

export default Notifications;
