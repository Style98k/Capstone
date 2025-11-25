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

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// Start Server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});
