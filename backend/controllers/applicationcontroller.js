import Applications from "../models/applicationmodel.js";
import Gig from "../models/gigmodel.js";

const ApplicationController = {
  getAll: (req, res) => {
    Applications.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  create: (req, res) => {
    Applications.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Application submitted!", id: result.insertId });
    });
  },

  getByGig: (req, res) => {
    Applications.getByGig(req.params.gigId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getByStudent: (req, res) => {
    Applications.getByStudent(req.params.studentId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  update: (req, res) => {
    // First, get the application to find out which gig it belongs to
    Applications.getAll((err, allApps) => {
      if (err) return res.status(500).json({ error: err });
      
      const app = allApps.find(a => a.id == req.params.id);
      if (!app) return res.status(404).json({ error: "Application not found" });
      
      // Update the application status
      Applications.update(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: err });
        
        // If marking as "hired", auto-reject other pending applications and update gig to "occupied"
        if (req.body.status === "hired") {
          // 1. Reject all other pending applications for this gig
          Applications.rejectOtherPending(app.gig_id, req.params.id, (err) => {
            if (err) console.error("Error rejecting other applications:", err);
          });
          
          // 2. Update gig status to "occupied"
          Gig.getById(app.gig_id, (err, results) => {
            if (err) return console.error("Error getting gig:", err);
            
            const gig = results[0];
            const gigUpdateData = {
              title: gig.title,
              description: gig.description,
              budget: gig.budget,
              category: gig.category,
              status: "occupied"
            };
            
            Gig.update(app.gig_id, gigUpdateData, (err) => {
              if (err) console.error("Error updating gig status:", err);
            });
          });
        }
        
        res.json({ message: "Application status updated!" });
      });
    });
  },

  delete: (req, res) => {
    Applications.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Application deleted!" });
    });
  }
};

export default ApplicationController;
