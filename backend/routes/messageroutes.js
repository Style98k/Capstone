import express from "express";
import MessageController from "../controllers/messagecontroller.js";

const router = express.Router();

// send message
router.post("/send", MessageController.sendMessage);

// get conversation (2 users)
router.get("/conversation/:user1/:user2", MessageController.getConversation);

export default router;
