import db from "../config/db.js";

const Gig = {
  // Get all gigs
  getAll: (callback) => {
    db.query("SELECT * FROM gigs", callback);
  },

  // Create new gig
  create: (data, callback) => {
    db.query(
      `INSERT INTO gigs (client_id, title, description, budget, category, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.client_id,
        data.title,
        data.description,
        data.budget,
        data.category,
        data.status || "open"
      ],
      callback
    );
  },

  // Get single gig
  getById: (id, callback) => {
    db.query("SELECT * FROM gigs WHERE id = ?", [id], callback);
  },

  // Update gig
  update: (id, data, callback) => {
    db.query(
      `UPDATE gigs SET 
       title=?, description=?, budget=?, category=?, status=?
       WHERE id=?`,
      [
        data.title,
        data.description,
        data.budget,
        data.category,
        data.status,
        id
      ],
      callback
    );
  },

  // Delete gig
  delete: (id, callback) => {
    db.query("DELETE FROM gigs WHERE id=?", [id], callback);
  }
};

export default Gig;
