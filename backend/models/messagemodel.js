import db from "../config/db.js";

const MessageModel = {
  // create a new message
  create(sender_id, receiver_id, content, callback) {
    const sql = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [sender_id, receiver_id, content], callback);
  },

  // get conversation between 2 users
  getConversation(user1, user2, callback) {
    const sql = `
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?)
      OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `;
    db.query(sql, [user1, user2, user2, user1], callback);
  }
};

export default MessageModel;
