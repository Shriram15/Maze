import express from "express";
import {
    getLeaderboard,
    exportLeaderboardCSV
} from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/", getLeaderboard);
router.get("/export", exportLeaderboardCSV);

export default router;
