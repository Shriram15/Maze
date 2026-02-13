import express from "express";
import { scanCheckpoint } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", scanCheckpoint);

export default router;
