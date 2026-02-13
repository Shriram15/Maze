import express from "express";
import { scanCheckpoint } from "../controllers/scanController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, scanCheckpoint);

export default router;
