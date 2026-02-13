import express from "express";
import { validateToken, getAthleteStatus } from "../controllers/authController.js";


const router = express.Router();

router.post("/validate", validateToken);
router.get("/status", getAthleteStatus);


export default router;
