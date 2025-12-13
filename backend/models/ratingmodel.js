import db from "../config/db.js";

const Ratings = {
  // get all ratings
  getAll: (callback) => {
    db.query("SELECT * FROM ratings", callback);
  },

  // get ratings for a specific user (where they are the student being rated)
  getByUser: (userId, callback) => {
    db.query("SELECT * FROM ratings WHERE student_id = ?", [userId], callback);
  },

  // get ratings given by a specific client
  getByClient: (clientId, callback) => {
    db.query("SELECT * FROM ratings WHERE client_id = ?", [clientId], callback);
  },

  // create rating
  create: (data, callback) => {
    db.query(
      `INSERT INTO ratings (gig_id, student_id, client_id, rating, feedback)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.gig_id,
        data.student_id,
        data.client_id,
        data.rating,
        data.feedback
      ],
      callback
    );
  },

  // delete rating
  delete: (id, callback) => {
    db.query("DELETE FROM ratings WHERE id = ?", [id], callback);
  }
};

export default Ratings;
