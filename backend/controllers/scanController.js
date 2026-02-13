import Athlete from "../models/Athlete.js";
import { generateLiveData } from "./adminController.js";

export const scanCheckpoint = async (req, res) => {
  try {
    const { token, checkpointId } = req.body;
    const now = new Date();

    const athlete = await Athlete.findOne({ token });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    // ❌ Already finished
    if (athlete.status === "finished") {
      return res.status(400).json({ message: "Race already finished" });
    }

    // 🟢 START
    if (checkpointId === 0) {
      if (athlete.status !== "not_started") {
        return res.status(400).json({ message: "Race already started" });
      }

      athlete.startTime = now;
      athlete.status = "running";

      await athlete.save();

      const liveData = await generateLiveData();
      req.io.emit("adminLiveUpdate", liveData);

      return res.json({ message: "Race started" });
    }

    // ❌ Cannot scan before start
    if (athlete.status === "not_started") {
      return res.status(400).json({ message: "You must scan START first" });
    }

    const MAX_CHECKPOINT = 2; // For now 1 and 2 only

    // 🏁 FINISH
    if (checkpointId === 999) {
      if (athlete.checkpoints.length !== MAX_CHECKPOINT) {
        return res.status(400).json({
          message: "Complete all checkpoints first"
        });
      }

      athlete.finishTime = now;
      athlete.totalTime = now - athlete.startTime;
      athlete.status = "finished";

      await athlete.save();

      const liveData = await generateLiveData();
      req.io.emit("adminLiveUpdate", liveData);

      const leaderboard = await Athlete.find({
        status: "finished"
      }).sort({ totalTime: 1 });

      req.io.emit("leaderboardUpdate", leaderboard);

      return res.json({ message: "Race finished" });
    }

    // 🔢 VALIDATE CHECKPOINT RANGE
    if (checkpointId < 1 || checkpointId > MAX_CHECKPOINT) {
      return res.status(400).json({
        message: "Invalid checkpoint"
      });
    }

    const lastCheckpoint =
      athlete.checkpoints.length > 0
        ? athlete.checkpoints[athlete.checkpoints.length - 1].checkpointId
        : 0;

    // ❌ DUPLICATE CHECK FIRST
    const alreadyScanned = athlete.checkpoints.find(
      cp => cp.checkpointId === checkpointId
    );

    if (alreadyScanned) {
      return res.status(400).json({
        message: "Checkpoint already scanned"
      });
    }

    // ❌ THEN CHECK ORDER
    if (checkpointId !== lastCheckpoint + 1) {
      return res.status(400).json({
        message: `Invalid checkpoint. Expected ${lastCheckpoint + 1}`
      });
    }


    // ✅ Save checkpoint
    athlete.checkpoints.push({
      checkpointId,
      time: now
    });

    await athlete.save();

    const liveData = await generateLiveData();
    req.io.emit("adminLiveUpdate", liveData);

    return res.json({
      message: `Checkpoint ${checkpointId} recorded`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
