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
      if (err) return res.status(500).json({ error: err });
      
      // Get gig details to send appropriate notifications
      if (transactionData.gig_id) {
        Gig.getById(transactionData.gig_id, (err2, gigResults) => {
          if (!err2 && gigResults && gigResults.length > 0) {
            const gig = gigResults[0];
            const amount = transactionData.amount || gig.budget;
            
            // Send notification to student (payment received)
            if (transactionData.student_id) {
              Notifications.create({
                user_id: transactionData.student_id,
                title: 'Payment Received! 💰',
                message: `You received ₱${amount?.toLocaleString()} for completing "${gig.title}".`,
                type: 'payment',
                link: '/student/earnings'
              }, () => {});
            }
            
            // Send notification to client (payment confirmed)
            if (gig.client_id) {
              Notifications.create({
                user_id: gig.client_id,
                title: 'Payment Sent',
                message: `Your payment of ₱${amount?.toLocaleString()} for "${gig.title}" has been processed.`,
                type: 'payment',
                link: '/client/payments'
              }, () => {});
            }
          }
        });
      }
      
      res.json({ message: "Transaction created!", id: result.insertId });
    });
  }
};

export default TransactionController;
