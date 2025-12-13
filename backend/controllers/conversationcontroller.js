import Conversations from "../models/conversationmodel.js";

const ConversationController = {
  // Get all conversations for a user
  getByUser: (req, res) => {
    const userId = req.params.userId;
    
    Conversations.getByUser(userId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get single conversation by ID
  getById: (req, res) => {
    const conversationId = req.params.id;
    
    Conversations.getById(conversationId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ message: "Conversation not found." });
      }
      
      res.json(results[0]);
    });
  },

  // Create new conversation (or get existing one)
  create: (req, res) => {
    const { gig_id, gig_title, participant1_id, participant2_id, last_message } = req.body;
    
    if (!gig_id || !participant1_id || !participant2_id) {
      return res.status(400).json({ 
        message: "gig_id, participant1_id, and participant2_id are required." 
      });
    }
    
    Conversations.create({
      gig_id,
      gig_title: gig_title || '',
      participant1_id,
      participant2_id,
      last_message: last_message || 'Conversation started'
    }, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Get the created/existing conversation with details
      Conversations.getById(result.insertId, (err2, results) => {
        if (err2) return res.status(500).json({ error: err2.message });
        
        res.status(result.existing ? 200 : 201).json({
          message: result.existing ? "Conversation already exists" : "Conversation created!",
          existing: result.existing || false,
          conversation: results[0] || result.conversation
        });
      });
    });
  },

  // Update last message
  updateLastMessage: (req, res) => {
    const conversationId = req.params.id;
    const { last_message } = req.body;
    
    if (!last_message) {
      return res.status(400).json({ message: "last_message is required." });
    }
    
    Conversations.updateLastMessage(conversationId, last_message, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Conversation not found." });
      }
      
      res.json({ message: "Conversation updated!" });
    });
  },

  // Delete conversation
  delete: (req, res) => {
    const conversationId = req.params.id;
    
    Conversations.delete(conversationId, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Conversation not found." });
      }
      
      res.json({ message: "Conversation deleted!" });
    });
  }
};

export default ConversationController;
