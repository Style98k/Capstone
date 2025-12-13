import db from "../config/db.js";

const Gig = {
  // Get all gigs with owner details
  getAll: (callback) => {
    const sql = `
      SELECT g.*, u.name as client_name, u.email as client_email, 
             u.rating as client_rating, u.profile_photo as client_photo
      FROM gigs g
      LEFT JOIN users u ON g.client_id = u.id
      ORDER BY g.created_at DESC
    `;
    db.query(sql, callback);
  },

  // Get open gigs only (for students browsing)
  getOpen: (callback) => {
    const sql = `
      SELECT g.*, u.name as client_name, u.email as client_email,
             u.rating as client_rating, u.profile_photo as client_photo
      FROM gigs g
      LEFT JOIN users u ON g.client_id = u.id
      WHERE g.status = 'open'
      ORDER BY g.created_at DESC
    `;
    db.query(sql, callback);
  },

  // Get gigs by client
  getByClient: (clientId, callback) => {
    db.query(
      "SELECT * FROM gigs WHERE client_id = ? ORDER BY created_at DESC",
      [clientId],
      callback
    );
  },

  // Create new gig
  create: (data, callback) => {
    db.query(
      `INSERT INTO gigs (client_id, title, description, budget, category, location, deadline, requirements, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.client_id,
        data.title,
        data.description,
        data.budget,
        data.category,
        data.location || 'Remote',
        data.deadline || null,
        data.requirements || '',
        data.status || "open"
      ],
      callback
    );
  },

  // Get single gig with owner details
  getById: (id, callback) => {
    const sql = `
      SELECT g.*, u.name as client_name, u.email as client_email,
             u.rating as client_rating, u.profile_photo as client_photo
      FROM gigs g
      LEFT JOIN users u ON g.client_id = u.id
      WHERE g.id = ?
    `;
    db.query(sql, [id], callback);
  },

  // Update gig
  update: (id, data, callback) => {
    const fields = [];
    const values = [];
    
    const allowedFields = ['title', 'description', 'budget', 'category', 
                           'status', 'location', 'deadline', 'requirements'];
    
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key) && data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });
    
    if (fields.length === 0) {
      return callback(new Error('No valid fields to update'));
    }
    
    values.push(id);
    
    const sql = `UPDATE gigs SET ${fields.join(', ')} WHERE id = ?`;
    db.query(sql, values, callback);
  },

  // Get applications count by gig
  getApplicationsByGig: (gigId, callback) => {
    db.query("SELECT * FROM applications WHERE gig_id = ?", [gigId], callback);
  },

  // Delete gig (cascade will handle related data)
  delete: (id, callback) => {
    db.query("DELETE FROM gigs WHERE id=?", [id], callback);
  }
};

export default Gig;
