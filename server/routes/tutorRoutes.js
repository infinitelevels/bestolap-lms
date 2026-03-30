import express from "express";
import * as controller from "../controllers/tutorController.js";

const router = express.Router();

router.post(
  "/apply",
  controller.uploadMiddleware,
  controller.applyTutor
);

export default router;