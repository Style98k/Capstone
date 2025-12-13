import Applications from "../models/applicationmodel.js";
import Gig from "../models/gigmodel.js";
import Notifications from "../models/notificationmodel.js";
import db from "../config/db.js";

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
        
        // Get gig details to notify the client
        Gig.getById(applicationData.gig_id, (err3, gigResults) => {
          if (!err3 && gigResults && gigResults.length > 0) {
            const gig = gigResults[0];
            
            // Get student name for the notification
            db.query('SELECT name FROM users WHERE id = ?', [applicationData.student_id], (err4, userResults) => {
              const studentName = userResults?.[0]?.name || 'A student';
              
              // Send notification to the client
              Notifications.create({
                user_id: gig.client_id,
                title: 'New Application! 📝',
                message: `${studentName} applied for your job "${gig.title}". Review their application now.`,
                type: 'application',
                link: '/client/applicants'
              }, (notifErr) => {
                if (notifErr) console.error('Error sending client notification:', notifErr);
              });
            });
          }
        });
        
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
          // Get gig details for notifications
          Gig.getById(app.gig_id, (errGig, gigResults) => {
            const gig = gigResults?.[0];
            const gigTitle = gig?.title || 'the gig';

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
                        title: 'Position Filled',
                        message: `The position for "${gigTitle}" has been filled. Keep applying to other opportunities!`,
                        type: 'application',
                        link: '/student/browse'
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
              message: `You've been hired for "${gigTitle}"! Check your messages to connect with the client.`,
              type: 'application',
              link: '/student/messages'
            }, () => {});
          });
        }
        
        // If marking as "rejected"
        if (newStatus === "rejected") {
          // Get gig title for better notification message
          Gig.getById(app.gig_id, (errGig, gigResults) => {
            const gigTitle = gigResults?.[0]?.title || 'the gig';
            
            Notifications.create({
              user_id: app.student_id,
              title: 'Application Update',
              message: `Unfortunately, your application for "${gigTitle}" was not selected. Keep applying!`,
              type: 'application',
              link: '/student/browse'
            }, () => {});
          });
        }

        // If marking as "completed"
        if (newStatus === "completed") {
          // Update gig status to completed
          Gig.update(app.gig_id, { status: "completed" }, (err3) => {
            if (err3) console.error("Error updating gig status:", err3);
          });

          // Get gig details for notification
          Gig.getById(app.gig_id, (err3, gigResults) => {
            if (!err3 && gigResults && gigResults.length > 0) {
              const gig = gigResults[0];
              
              // Notify student that job is completed
              Notifications.create({
                user_id: app.student_id,
                title: 'Job Completed! 🎉',
                message: `Great work! "${gig.title}" has been marked as completed. Payment will be processed soon.`,
                type: 'job_completed',
                link: '/student/applications'
              }, () => {});

              // Notify client that job is completed
              Notifications.create({
                user_id: gig.client_id,
                title: 'Job Completed',
                message: `"${gig.title}" has been marked as completed. You can now process the payment.`,
                type: 'job_completed',
                link: '/client/payments'
              }, () => {});
            }
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
