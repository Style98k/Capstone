import express from "express";
import NotificationController from "../controllers/notificationcontroller.js";

const router = express.Router();

router.get("/user/:userId", NotificationController.getByUser);
router.get("/user/:userId/unread-count", NotificationController.getUnreadCount);
router.post("/", NotificationController.create);
router.post("/role", NotificationController.createForRole);
router.put("/:id/read", NotificationController.markAsRead);
router.put("/user/:userId/read-all", NotificationController.markAllAsRead);
router.delete("/:id", NotificationController.delete);

export default router;
