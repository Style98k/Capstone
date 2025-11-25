import Transactions from "../models/transactionmodel.js";

const TransactionController = {
  getAll: (req, res) => {
    Transactions.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getByUser: (req, res) => {
    Transactions.getByUser(req.params.userId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getByGig: (req, res) => {
    Transactions.getByGig(req.params.gigId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  create: (req, res) => {
    Transactions.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Transaction created!", id: result.insertId });
    });
  }
};

export default TransactionController;
