import express from "express";
import cors from "cors";
import db from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Start Server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});
