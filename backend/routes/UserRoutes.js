import express from "express";
import { register, login, getProfile } from "../controllers/UserController.js";
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

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GET PROFILE (protected)
router.get("/profile", authMiddleware, getProfile);

export default router;
