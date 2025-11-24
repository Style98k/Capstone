import express from "express";
import cors from "cors";
import db from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js";
import gigRoutes from "./routes/gigroutes.js";
import applicationRoutes from "./routes/applicationroutes.js";

const app = express();

// Middleware
app.use("/api/gigs", gigRoutes);
app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);

// Routes
app.use("/api/users", userRoutes);

// Start Server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});
