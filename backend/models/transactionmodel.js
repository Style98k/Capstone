import db from "../config/db.js";

const Transactions = {
  // get all transactions
  getAll: (callback) => {
    db.query("SELECT * FROM transactions", callback);
  },

  // get transactions for a user (incoming + outgoing)
  getByUser: (userId, callback) => {
    db.query(
      "SELECT * FROM transactions WHERE student_id = ? OR client_id = ?",
      [userId, userId],
      callback
    );
  },

  // get transactions for a gig
  getByGig: (gigId, callback) => {
    db.query(
      "SELECT * FROM transactions WHERE gig_id = ?",
      [gigId],
      callback
    );
  },

  // create transaction (payment record)
  create: (data, callback) => {
    db.query(
      `INSERT INTO transactions (gig_id, student_id, client_id, amount, status, type, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.gig_id,
        data.student_id,
        data.client_id,
        data.amount,
        data.status || 'pending',
        data.type || 'payment',
        data.description || null
      ],
      callback
    );
  }
};

export default Transactions;
