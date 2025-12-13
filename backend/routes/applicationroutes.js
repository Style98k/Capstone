import express from "express";
import ApplicationController from "../controllers/applicationcontroller.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// GET all applications (protected - admin only in practice)
router.get("/", authMiddleware, ApplicationController.getAll);

// CREATE new application (protected)
router.post("/", authMiddleware, ApplicationController.create);

// GET applications for a client's gigs (protected)
router.get("/client/:clientId", authMiddleware, ApplicationController.getByClientGigs);

// GET applications by gig (protected)
router.get("/gig/:gigId", authMiddleware, ApplicationController.getByGig);

// GET applications by student (protected)
router.get("/student/:studentId", authMiddleware, ApplicationController.getByStudent);

// UPDATE application status (protected)
router.put("/:id", authMiddleware, ApplicationController.update);

// DELETE application (protected)
router.delete("/:id", authMiddleware, ApplicationController.delete);

export default router;
