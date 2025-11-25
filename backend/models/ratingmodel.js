import db from "../config/db.js";

const Ratings = {
  // get all ratings
  getAll: (callback) => {
    db.query("SELECT * FROM ratings", callback);
  },

  // get ratings for a specific user
  getByUser: (userId, callback) => {
    db.query("SELECT * FROM ratings WHERE target_user_id = ?", [userId], callback);
  },

  // create rating
  create: (data, callback) => {
    db.query(
      `INSERT INTO ratings (gig_id, rater_id, target_user_id, stars, review)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.gig_id,
        data.rater_id,
        data.target_user_id,
        data.stars,
        data.review
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
