import express from "express";
import RatingController from "../controllers/ratingcontroller.js";

const router = express.Router();

router.get("/", RatingController.getAll);
router.get("/user/:userId", RatingController.getByUser);
router.post("/", RatingController.create);
router.delete("/:id", RatingController.delete);

export default router;
