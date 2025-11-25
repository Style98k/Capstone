import express from "express";
import TransactionController from "../controllers/transactioncontroller.js";

const router = express.Router();

router.get("/", TransactionController.getAll);
router.get("/user/:userId", TransactionController.getByUser);
router.get("/gig/:gigId", TransactionController.getByGig);
router.post("/", TransactionController.create);

export default router;
