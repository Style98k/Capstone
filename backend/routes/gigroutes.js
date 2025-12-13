import express from "express";
import GigController from "../controllers/gigcontroller.js";
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

// Optional auth middleware (for public routes that may have auth)
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.user = decoded;
    } catch (err) {
      // Continue without user
    }
  }
  next();
};

// GET all gigs (public)
router.get("/", GigController.getAllGigs);

// GET only open gigs (public - for students browsing)
router.get("/open", GigController.getOpenGigs);

// GET gigs by client (protected)
router.get("/client/:clientId", authMiddleware, GigController.getGigsByClient);

// CREATE new gig (protected)
router.post("/", authMiddleware, GigController.createGig);

// GET single gig (public with optional auth)
router.get("/:id", optionalAuth, GigController.getGig);

// UPDATE gig (protected)
router.put("/:id", authMiddleware, GigController.updateGig);

// DELETE gig (protected)
router.delete("/:id", authMiddleware, GigController.deleteGig);

export default router;
