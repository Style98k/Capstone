import express from "express";
import cors from "cors";
import db from "./config/db.js";

import userRoutes from "./routes/UserRoutes.js";
import gigRoutes from "./routes/gigroutes.js";
import applicationRoutes from "./routes/applicationroutes.js";
import ratingRoutes from "./routes/ratingroutes.js";
import transactionRoutes from "./routes/transactionroutes.js";
import notificationRoutes from "./routes/notificationroutes.js";
import messageRoutes from "./routes/messageroutes.js";
import conversationRoutes from "./routes/conversationroutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// DEBUG: Check users and notifications in database
app.get("/api/debug/users", (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.query("SELECT id, user_id, title, type, created_at FROM notifications ORDER BY created_at DESC LIMIT 10", (err2, notifications) => {
      if (err2) return res.status(500).json({ error: err2.message });
      
      res.json({
        users: users,
        recent_notifications: notifications,
        summary: {
          total_users: users.length,
          admins: users.filter(u => u.role?.toLowerCase() === 'admin').map(u => ({ id: u.id, name: u.name })),
          students: users.filter(u => u.role?.toLowerCase() === 'student').map(u => ({ id: u.id, name: u.name })),
          clients: users.filter(u => u.role?.toLowerCase() === 'client').map(u => ({ id: u.id, name: u.name }))
        }
      });
    });
  });
});

// Start Server
app.listen(5001, () => {
  console.log("==========================================");
  console.log("Server running on port 5001");
  console.log("Debug endpoint: http://localhost:5001/api/debug/users");
  console.log("==========================================");
});
