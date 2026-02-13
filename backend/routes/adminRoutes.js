import express from "express";
import {
    createAthlete,
    getLiveDashboard,
    deleteAthlete
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-athlete", createAthlete);
router.get("/live", getLiveDashboard);
router.delete("/delete-athlete/:id", deleteAthlete);

export default router;
