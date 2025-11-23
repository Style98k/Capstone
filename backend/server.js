import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("QuickGig Backend is Running");
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
