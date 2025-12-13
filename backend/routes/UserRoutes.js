import express from "express";
import { 
  register, 
  login, 
  getProfile, 
  getUsers, 
  getUserById, 
  updateUserProfile, 
  updateUserVerification,
  removeUser
} from "../controllers/UserController.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "secret123"); // same secret as controller
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Optional auth middleware (doesn't block if no token)
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.user = decoded;
    } catch (err) {
      // Token invalid, continue without user
    }
  }
  next();
};

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GET ALL USERS (protected - for admin/client)
router.get("/", authMiddleware, getUsers);

// GET PROFILE (protected)
router.get("/profile", authMiddleware, getProfile);

// GET USER BY ID (protected)
router.get("/:id", authMiddleware, getUserById);

// UPDATE USER PROFILE (protected)
router.put("/:id", authMiddleware, updateUserProfile);

// UPDATE VERIFICATION STATUS (admin only)
router.put("/:id/verify", authMiddleware, updateUserVerification);

// DELETE USER (admin only)
router.delete("/:id", authMiddleware, removeUser);

export default router;
