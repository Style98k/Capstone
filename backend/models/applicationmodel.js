import db from "../config/db.js";

const Applications = {
  // Get all applications with user and gig details (JOIN query)
  getAll: (callback) => {
    const sql = `
      SELECT 
        a.*,
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        u.title as student_title,
        u.location as student_location,
        u.skills as student_skills,
        u.rating as student_rating,
        u.total_ratings as student_total_ratings,
        u.profile_photo as student_photo,
        u.school_id_verified,
        u.assessment_verified,
        g.title as gig_title,
        g.category as gig_category,
        g.budget as gig_budget,
        g.status as gig_status,
        g.client_id
      FROM applications a
      LEFT JOIN users u ON a.student_id = u.id
      LEFT JOIN gigs g ON a.gig_id = g.id
      ORDER BY a.created_at DESC
    `;
    db.query(sql, callback);
  },

  // Get all applications with details for a specific client's gigs
  getByClientGigs: (clientId, callback) => {
    const sql = `
      SELECT 
        a.*,
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        u.title as student_title,
        u.location as student_location,
        u.skills as student_skills,
        u.rating as student_rating,
        u.total_ratings as student_total_ratings,
        u.profile_photo as student_photo,
        u.school_id_verified,
        u.assessment_verified,
        g.title as gig_title,
        g.category as gig_category,
        g.budget as gig_budget,
        g.status as gig_status,
        g.client_id
      FROM applications a
      LEFT JOIN users u ON a.student_id = u.id
      LEFT JOIN gigs g ON a.gig_id = g.id
      WHERE g.client_id = ?
      ORDER BY a.created_at DESC
    `;
    db.query(sql, [clientId], callback);
  },

  // Apply to gig
  create: (data, callback) => {
    db.query(
      `INSERT INTO applications (gig_id, student_id, message, proposal, cover_letter, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.gig_id,
        data.student_id,
        data.message || '',
        data.proposal || '',
        data.cover_letter || '',
        data.status || "pending"
      ],
      callback
    );
  },

  // Get applications by gig with student details
  getByGig: (gigId, callback) => {
    const sql = `
      SELECT 
        a.*,
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        u.title as student_title,
        u.rating as student_rating,
        u.profile_photo as student_photo
      FROM applications a
      LEFT JOIN users u ON a.student_id = u.id
      WHERE a.gig_id = ?
      ORDER BY a.created_at DESC
    `;
    db.query(sql, [gigId], callback);
  },

  // Get applications by student with gig details
  getByStudent: (studentId, callback) => {
    const sql = `
      SELECT 
        a.*,
        g.title as gig_title,
        g.category as gig_category,
        g.budget as gig_budget,
        g.status as gig_status,
        g.client_id,
        c.name as client_name,
        c.email as client_email
      FROM applications a
      LEFT JOIN gigs g ON a.gig_id = g.id
      LEFT JOIN users c ON g.client_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.created_at DESC
    `;
    db.query(sql, [studentId], callback);
  },

  // Get single application by ID
  getById: (id, callback) => {
    db.query("SELECT * FROM applications WHERE id = ?", [id], callback);
  },

  // Update application status
  update: (id, data, callback) => {
    db.query(
      "UPDATE applications SET status=? WHERE id=?",
      [data.status, id],
      callback
    );
  },

  // Reject all pending applications for a gig except one
  rejectOtherPending: (gigId, excludeAppId, callback) => {
    db.query(
      "UPDATE applications SET status=? WHERE gig_id=? AND id != ? AND status=?",
      ["rejected", gigId, excludeAppId, "pending"],
      callback
    );
  },

  // Delete (cancel application)
  delete: (id, callback) => {
    db.query("DELETE FROM applications WHERE id=?", [id], callback);
  }
};

export default Applications;
