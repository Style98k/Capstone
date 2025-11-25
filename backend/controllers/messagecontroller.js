import MessageModel from "../models/messagemodel.js";

const MessageController = {
  sendMessage(req, res) {
    const { sender_id, receiver_id, content } = req.body;

    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    MessageModel.create(sender_id, receiver_id, content, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Message sent" });
    });
  },

  getConversation(req, res) {
    const { user1, user2 } = req.params;

    MessageModel.getConversation(user1, user2, (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.json({ success: true, messages: rows });
    });
  }
};

export default MessageController;
