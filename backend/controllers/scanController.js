import Athlete from "../models/Athlete.js";
import { generateLiveData } from "./adminController.js";

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

export const scanCheckpoint = async (req, res) => {
  try {
    const now = new Date();
    const { checkpointId } = req.body;

    const athlete = await Athlete.findById(req.user.id);

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

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

    if (athlete.status === "not_started") {
      return res.status(400).json({ message: "Scan START first" });
    }

    const VALID_CHECKPOINTS = [1, 2];

    // 🏁 FINISH (MUST COME BEFORE STRICT VALIDATION)
    if (checkpointId === 999) {
      if (athlete.checkpoints.length !== VALID_CHECKPOINTS.length) {
        return res.status(400).json({
          message: "Complete all checkpoints first"
        });
      }

      athlete.finishTime = now;
      const finalTime = now - athlete.startTime;

      athlete.attempts.push({
        totalTime: finalTime
      });

      athlete.totalTime = finalTime;
      athlete.status = "finished";

      await athlete.save();

      const liveData = await generateLiveData();
      req.io.emit("adminLiveUpdate", liveData);

      return res.json({ message: "Race finished" });
    }

    // 🔒 STRICT CHECKPOINT VALIDATION
    if (!VALID_CHECKPOINTS.includes(checkpointId)) {
      return res.status(400).json({
        message: "Invalid checkpoint"
      });
    }

    const lastCheckpoint =
      athlete.checkpoints.length > 0
        ? athlete.checkpoints[athlete.checkpoints.length - 1].checkpointId
        : 0;

    // ❌ Duplicate
    if (athlete.checkpoints.some(cp => cp.checkpointId === checkpointId)) {
      return res.status(400).json({
        message: "Checkpoint already scanned"
      });
    }

    // ❌ Wrong order
    if (checkpointId !== lastCheckpoint + 1) {
      return res.status(400).json({
        message: `Expected checkpoint ${lastCheckpoint + 1}`
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
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
