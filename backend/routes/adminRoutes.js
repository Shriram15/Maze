import express from "express";
import {
    createAthlete,
    getLiveDashboard,
    deleteAthlete,
    retakeAthlete,
    resetRunningAthletes
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-athlete", createAthlete);
router.get("/live", getLiveDashboard);
router.delete("/delete-athlete/:id", deleteAthlete);
router.post("/retake/:id", retakeAthlete);
router.post("/reset-running", resetRunningAthletes);

export default router;
