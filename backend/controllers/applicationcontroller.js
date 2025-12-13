import Applications from "../models/applicationmodel.js";
import Gig from "../models/gigmodel.js";
import Notifications from "../models/notificationmodel.js";

const ApplicationController = {
  // Get all applications with user and gig details
  getAll: (req, res) => {
    Applications.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get applications for a client's gigs
  getByClientGigs: (req, res) => {
    const clientId = req.params.clientId;
    Applications.getByClientGigs(clientId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Create new application
  create: (req, res) => {
    const applicationData = {
      ...req.body,
      student_id: req.body.student_id || req.user?.id
    };

    Applications.create(applicationData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Get the created application with details
      Applications.getByStudent(applicationData.student_id, (err2, results) => {
        if (err2) return res.status(500).json({ error: err2.message });
        
        const newApp = results.find(a => a.id === result.insertId);
        res.status(201).json({ 
          message: "Application submitted!", 
          id: result.insertId,
          application: newApp
        });
      });
    });
  },

  // Get applications by gig
  getByGig: (req, res) => {
    Applications.getByGig(req.params.gigId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Get applications by student
  getByStudent: (req, res) => {
    Applications.getByStudent(req.params.studentId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // Update application status (hire/reject)
  update: (req, res) => {
    const appId = req.params.id;
    const newStatus = req.body.status;

    // First, get the application details
    Applications.getById(appId, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      const app = results[0];
      
      // Update the application status
      Applications.update(appId, req.body, (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        
        // If marking as "hired" or "accepted"
        if (newStatus === "hired" || newStatus === "accepted") {
          // 1. Reject all other pending applications for this gig
          Applications.rejectOtherPending(app.gig_id, appId, (err3) => {
            if (err3) console.error("Error rejecting other applications:", err3);
            
            // Send notifications to rejected applicants
            Applications.getByGig(app.gig_id, (err4, allApps) => {
              if (!err4 && allApps) {
                allApps.forEach(a => {
                  if (a.id != appId && a.student_id !== app.student_id) {
                    Notifications.create({
                      user_id: a.student_id,
                      title: 'Application Update',
                      message: `Your application has been rejected. The position has been filled.`,
                      type: 'application',
                      is_read: 0
                    }, () => {});
                  }
                });
              }
            });
          });
          
          // 2. Update gig status to "occupied" or "in_progress"
          Gig.update(app.gig_id, { status: "in_progress" }, (err3) => {
            if (err3) console.error("Error updating gig status:", err3);
          });

          // 3. Send notification to the hired student
          Notifications.create({
            user_id: app.student_id,
            title: 'Congratulations! 🎉',
            message: `You've been hired for the gig! Check your messages to connect with the client.`,
            type: 'application',
            is_read: 0
          }, () => {});
        }
        
        // If marking as "rejected"
        if (newStatus === "rejected") {
          Notifications.create({
            user_id: app.student_id,
            title: 'Application Update',
            message: `Unfortunately, your application was not selected for this gig.`,
            type: 'application',
            is_read: 0
          }, () => {});
        }

        // If marking as "completed"
        if (newStatus === "completed") {
          // Update gig status to completed
          Gig.update(app.gig_id, { status: "completed" }, (err3) => {
            if (err3) console.error("Error updating gig status:", err3);
          });
        }
        
        // Get updated application with details
        Applications.getById(appId, (err3, updatedResults) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ 
            message: "Application status updated!",
            application: updatedResults[0]
          });
        });
      });
    });
  },

  // Delete application
  delete: (req, res) => {
    Applications.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Application deleted!" });
    });
  }
};

export default ApplicationController;
