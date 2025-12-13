import Transactions from "../models/transactionmodel.js";
import Notifications from "../models/notificationmodel.js";
import Gig from "../models/gigmodel.js";
import db from "../config/db.js";

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
    const transactionData = req.body;
    
    Transactions.create(transactionData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message || err });
      
      // Get gig details to send appropriate notifications
      if (transactionData.gig_id) {
        Gig.getById(transactionData.gig_id, (err2, gigResults) => {
          if (!err2 && gigResults && gigResults.length > 0) {
            const gig = gigResults[0];
            const amount = Number(transactionData.amount) || Number(gig.budget) || 0;
            const formattedAmount = amount.toLocaleString();
            
            // Send notification to student (payment received)
            // Client doesn't need notification since they triggered the payment
            if (transactionData.student_id) {
              Notifications.create({
                user_id: transactionData.student_id,
                title: 'Payment Received! 💰',
                message: `You received ₱${formattedAmount} for completing "${gig.title}".`,
                type: 'payment',
                link: '/student/earnings'
              }, () => {});
            }
          }
        });
      }
      
      res.json({ message: "Transaction created!", id: result.insertId });
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    Transactions.update(id, updateData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message || err });
      
      // If status changed to completed, send payment notification to student
      if (updateData.status === 'completed') {
        Transactions.getById(id, (err2, transResults) => {
          if (!err2 && transResults && transResults.length > 0) {
            const trans = transResults[0];
            Gig.getById(trans.gig_id, (err3, gigResults) => {
              if (!err3 && gigResults && gigResults.length > 0) {
                const gig = gigResults[0];
                const amount = Number(trans.amount) || Number(gig.budget) || 0;
                const formattedAmount = amount.toLocaleString();
                
                // Send notification to student (payment received)
                if (trans.student_id) {
                  Notifications.create({
                    user_id: trans.student_id,
                    title: 'Payment Received! 💰',
                    message: `You received ₱${formattedAmount} for completing "${gig.title}".`,
                    type: 'payment',
                    link: '/student/earnings'
                  }, () => {});
                }
              }
            });
          }
        });
      }
      
      res.json({ message: "Transaction updated!" });
    });
  }
};

export default TransactionController;
