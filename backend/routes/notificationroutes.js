import express from "express";
import NotificationController from "../controllers/notificationcontroller.js";

const router = express.Router();

router.get("/user/:userId", NotificationController.getByUser);
router.post("/", NotificationController.create);
router.put("/:id/read", NotificationController.markAsRead);
router.delete("/:id", NotificationController.delete);

export default router;
