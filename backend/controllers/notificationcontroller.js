import Notifications from "../models/notificationmodel.js";

const NotificationController = {
  getByUser: (req, res) => {
    Notifications.getByUser(req.params.userId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  create: (req, res) => {
    Notifications.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Notification sent!", id: result.insertId });
    });
  },

  // Create notification for all users of a role
  createForRole: (req, res) => {
    const { role, title, message, type, link } = req.body;
    
    if (!role || !message) {
      return res.status(400).json({ error: "role and message are required" });
    }
    
    Notifications.createForRole(role, { title, message, type, link }, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: `Notification sent to all ${role}s!`, affectedRows: result.affectedRows });
    });
  },

  markAsRead: (req, res) => {
    Notifications.markAsRead(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Notification marked as read!" });
    });
  },

  markAllAsRead: (req, res) => {
    Notifications.markAllAsRead(req.params.userId, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "All notifications marked as read!" });
    });
  },

  delete: (req, res) => {
    Notifications.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Notification deleted!" });
    });
  },

  getUnreadCount: (req, res) => {
    Notifications.getUnreadCount(req.params.userId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ count: results[0]?.count || 0 });
    });
  }
};

export default NotificationController;
