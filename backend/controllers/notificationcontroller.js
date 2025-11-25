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

  markAsRead: (req, res) => {
    Notifications.markAsRead(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Notification marked as read!" });
    });
  },

  delete: (req, res) => {
    Notifications.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Notification deleted!" });
    });
  }
};

export default NotificationController;
