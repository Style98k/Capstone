import db from "../config/db.js";

const Conversations = {
  // Get all conversations for a user
  getByUser: (userId, callback) => {
    const sql = `
      SELECT 
        c.*,
        u1.name as participant1_name,
        u1.email as participant1_email,
        u1.profile_photo as participant1_photo,
        u2.name as participant2_name,
        u2.email as participant2_email,
        u2.profile_photo as participant2_photo,
        g.title as gig_title,
        g.status as gig_status
      FROM conversations c
      LEFT JOIN users u1 ON c.participant1_id = u1.id
      LEFT JOIN users u2 ON c.participant2_id = u2.id
      LEFT JOIN gigs g ON c.gig_id = g.id
      WHERE c.participant1_id = ? OR c.participant2_id = ?
      ORDER BY c.updated_at DESC
    `;
    db.query(sql, [userId, userId], callback);
  },

  // Get single conversation by ID
  getById: (id, callback) => {
    const sql = `
      SELECT 
        c.*,
        u1.name as participant1_name,
        u1.email as participant1_email,
        u1.profile_photo as participant1_photo,
        u2.name as participant2_name,
        u2.email as participant2_email,
        u2.profile_photo as participant2_photo,
        g.title as gig_title,
        g.status as gig_status
      FROM conversations c
      LEFT JOIN users u1 ON c.participant1_id = u1.id
      LEFT JOIN users u2 ON c.participant2_id = u2.id
      LEFT JOIN gigs g ON c.gig_id = g.id
      WHERE c.id = ?
    `;
    db.query(sql, [id], callback);
  },

  // Check if conversation exists between two users for a gig
  findExisting: (gigId, user1Id, user2Id, callback) => {
    const sql = `
      SELECT * FROM conversations 
      WHERE gig_id = ? AND 
      ((participant1_id = ? AND participant2_id = ?) OR 
       (participant1_id = ? AND participant2_id = ?))
    `;
    db.query(sql, [gigId, user1Id, user2Id, user2Id, user1Id], callback);
  },

  // Create new conversation
  create: (data, callback) => {
    // First check if conversation already exists
    Conversations.findExisting(
      data.gig_id,
      data.participant1_id,
      data.participant2_id,
      (err, results) => {
        if (err) return callback(err);
        
        // If conversation exists, return it
        if (results && results.length > 0) {
          return callback(null, { 
            insertId: results[0].id, 
            existing: true,
            conversation: results[0]
          });
        }
        
        // Create new conversation
        db.query(
          `INSERT INTO conversations (gig_id, gig_title, participant1_id, participant2_id, last_message)
           VALUES (?, ?, ?, ?, ?)`,
          [
            data.gig_id,
            data.gig_title || '',
            data.participant1_id,
            data.participant2_id,
            data.last_message || 'Conversation started'
          ],
          callback
        );
      }
    );
  },

  // Update last message
  updateLastMessage: (id, message, callback) => {
    db.query(
      'UPDATE conversations SET last_message = ? WHERE id = ?',
      [message, id],
      callback
    );
  },

  // Delete conversation
  delete: (id, callback) => {
    db.query('DELETE FROM conversations WHERE id = ?', [id], callback);
  }
};

export default Conversations;
