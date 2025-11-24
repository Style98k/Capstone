import db from "../config/db.js";

const Applications = {
  // Get all applications
  getAll: (callback) => {
    db.query("SELECT * FROM applications", callback);
  },

  // Apply to gig
  create: (data, callback) => {
    db.query(
      `INSERT INTO applications (gig_id, student_id, cover_letter, status)
       VALUES (?, ?, ?, ?)`,
      [
        data.gig_id,
        data.student_id,
        data.cover_letter,
        data.status || "pending"
      ],
      callback
    );
  },

  // Get applications by gig
  getByGig: (gigId, callback) => {
    db.query("SELECT * FROM applications WHERE gig_id = ?", [gigId], callback);
  },

  // Get applications by student
  getByStudent: (studentId, callback) => {
    db.query("SELECT * FROM applications WHERE student_id = ?", [studentId], callback);
  },

  // Update application status
  update: (id, data, callback) => {
    db.query(
      "UPDATE applications SET status=? WHERE id=?",
      [data.status, id],
      callback
    );
  },

  // Delete (cancel application)
  delete: (id, callback) => {
    db.query("DELETE FROM applications WHERE id=?", [id], callback);
  }
};

export default Applications;
