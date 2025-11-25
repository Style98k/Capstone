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

  // create notification
  create: (data, callback) => {
    db.query(
      `INSERT INTO notifications (user_id, message, link, is_read)
       VALUES (?, ?, ?, ?)`,
      [
        data.user_id,
        data.message,
        data.link || "",
        data.is_read || 0
      ],
      callback
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

  // delete notification
  delete: (id, callback) => {
    db.query("DELETE FROM notifications WHERE id = ?", [id], callback);
  }
};

export default Notifications;
