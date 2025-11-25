import db from "../config/db.js";

const Transactions = {
  // get all transactions
  getAll: (callback) => {
    db.query("SELECT * FROM transactions", callback);
  },

  // get transactions for a user (incoming + outgoing)
  getByUser: (userId, callback) => {
    db.query(
      "SELECT * FROM transactions WHERE from_user = ? OR to_user = ?",
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
      `INSERT INTO transactions (gig_id, from_user, to_user, amount)
       VALUES (?, ?, ?, ?)`,
      [
        data.gig_id,
        data.from_user,
        data.to_user,
        data.amount
      ],
      callback
    );
  }
};

export default Transactions;
