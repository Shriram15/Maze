import express from "express";
import { loginAthlete } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAthlete);

export default router;
