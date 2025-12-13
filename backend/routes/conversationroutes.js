import express from "express";
import ConversationController from "../controllers/conversationcontroller.js";
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

// GET conversations for a user (protected)
router.get("/user/:userId", authMiddleware, ConversationController.getByUser);

// GET single conversation by ID (protected)
router.get("/:id", authMiddleware, ConversationController.getById);

// CREATE new conversation (protected)
router.post("/", authMiddleware, ConversationController.create);

// UPDATE conversation's last message (protected)
router.put("/:id", authMiddleware, ConversationController.updateLastMessage);

// DELETE conversation (protected)
router.delete("/:id", authMiddleware, ConversationController.delete);

export default router;
