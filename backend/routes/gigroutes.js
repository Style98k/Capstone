import express from "express";
import GigController from "../controllers/gigcontroller.js";

const router = express.Router();

router.get("/", GigController.getAllGigs);
router.post("/", GigController.createGig);
router.get("/:id", GigController.getGig);
router.put("/:id", GigController.updateGig);
router.delete("/:id", GigController.deleteGig);

export default router;
