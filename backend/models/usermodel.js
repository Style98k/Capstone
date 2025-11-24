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
