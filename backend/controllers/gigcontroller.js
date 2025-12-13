import Gig from "../models/gigmodel.js";
import Notifications from "../models/notificationmodel.js";

const GigController = {
  // Get all gigs with owner details
  getAllGigs: (req, res) => {
    Gig.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get only open gigs (for students browsing)
  getOpenGigs: (req, res) => {
    Gig.getOpen((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get gigs by client ID
  getGigsByClient: (req, res) => {
    const clientId = req.params.clientId;
    Gig.getByClient(clientId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Create new gig
  createGig: (req, res) => {
    // Add client_id from authenticated user if not provided
    const gigData = {
      ...req.body,
      client_id: req.body.client_id || req.user?.id
    };

    Gig.create(gigData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Get the created gig with full details
      Gig.getById(result.insertId, (err2, results) => {
        if (err2) return res.status(500).json({ error: err2.message });
        
        const newGig = results[0];
        
        console.log(`[GigController] Gig created with ID: ${result.insertId}, Title: "${newGig?.title || gigData.title}"`);
        console.log(`[GigController] Sending notifications to admins and students...`);
        
        // Send notification to all admins
        Notifications.createForRole('admin', {
          title: 'New Job Posted',
          message: `New job "${newGig?.title || gigData.title}" needs review. Click to manage gigs.`,
          type: 'gig_review',
          link: '/admin/gigs'
        }, (notifErr, notifResult) => {
          if (notifErr) {
            console.error('[GigController] Error sending admin notification:', notifErr);
          } else {
            console.log('[GigController] Admin notification result:', notifResult);
          }
        });
        
        // Send notification to all students about new opportunity
        Notifications.createForRole('student', {
          title: 'New Opportunity! 🎉',
          message: `A new ${gigData.category || 'gig'} job is available: "${newGig?.title || gigData.title}". Apply now!`,
          type: 'new_gig',
          link: `/gigs/${result.insertId}`
        }, (notifErr, notifResult) => {
          if (notifErr) {
            console.error('[GigController] Error sending student notification:', notifErr);
          } else {
            console.log('[GigController] Student notification result:', notifResult);
          }
        });
        
        res.status(201).json({ 
          message: "Gig created!", 
          id: result.insertId,
          gig: newGig
        });
      });
    });
  },

  // Get single gig with owner details
  getGig: (req, res) => {
    Gig.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ message: "Gig not found." });
      }
      
      res.json(results[0]);
    });
  },

  // Update gig
  updateGig: (req, res) => {
    const gigId = req.params.id;
    
    // First check if gig exists and user has permission
    Gig.getById(gigId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ message: "Gig not found." });
      }
      
      const gig = results[0];
      
      // Check ownership (unless admin)
      if (req.user && gig.client_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Not authorized to update this gig." });
      }
      
      Gig.update(gigId, req.body, (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });
        
        // Get updated gig
        Gig.getById(gigId, (err3, updatedResults) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: "Gig updated!", gig: updatedResults[0] });
        });
      });
    });
  },

  // Delete gig
  deleteGig: (req, res) => {
    const gigId = req.params.id;
    
    // First check if gig exists and user has permission
    Gig.getById(gigId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ message: "Gig not found." });
      }
      
      const gig = results[0];
      
      // Check ownership (unless admin)
      if (req.user && gig.client_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Not authorized to delete this gig." });
      }
      
      Gig.delete(gigId, (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Gig deleted!" });
      });
    });
  }
};

export default GigController;
