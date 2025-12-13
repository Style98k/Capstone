import db from "../config/db.js";

// Create a new user
export const createUser = (name, email, password, role, callback) => {
  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [name, email, password, role], callback);
};

// Find user by email (for login)
export const findUserByEmail = (email, callback) => {
  const sql = `
    SELECT * FROM users WHERE email = ?
  `;
  db.query(sql, [email], callback);
};

// Get user by ID
export const findUserById = (id, callback) => {
  const sql = `
    SELECT * FROM users WHERE id = ?
  `;
  db.query(sql, [id], callback);
};

// Get all users (for admin and applicant listings)
export const getAllUsers = (callback) => {
  const sql = `
    SELECT id, name, email, phone, role, location, title, skills, 
           rating, total_ratings, school_id_verified, assessment_verified,
           profile_photo, created_at
    FROM users
  `;
  db.query(sql, callback);
};

// Update user profile
export const updateUser = (id, data, callback) => {
  // Build dynamic UPDATE query based on provided fields
  const allowedFields = [
    'name', 'phone', 'school_id', 'location', 'title', 'skills',
    'experience', 'availability', 'profile_photo', 'facebook', 
    'other_social', 'school_id_verified', 'assessment_verified', 
    'phone_verified', 'rating', 'total_ratings'
  ];
  
  const fields = [];
  const values = [];
  
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
  
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  db.query(sql, values, callback);
};

// Update user verification status (for admin)
export const updateVerificationStatus = (id, field, status, callback) => {
  const allowedFields = ['school_id_verified', 'assessment_verified', 'phone_verified'];
  
  if (!allowedFields.includes(field)) {
    return callback(new Error('Invalid verification field'));
  }
  
  const sql = `UPDATE users SET ${field} = ? WHERE id = ?`;
  db.query(sql, [status, id], callback);
};

// Delete user
export const deleteUser = (id, callback) => {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [id], callback);
};
