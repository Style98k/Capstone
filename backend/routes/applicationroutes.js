import express from "express";
import ApplicationController from "../controllers/applicationcontroller.js";

const router = express.Router();

router.get("/", ApplicationController.getAll);
router.post("/", ApplicationController.create);

router.get("/gig/:gigId", ApplicationController.getByGig);
router.get("/student/:studentId", ApplicationController.getByStudent);

router.put("/:id", ApplicationController.update);
router.delete("/:id", ApplicationController.delete);

export default router;
