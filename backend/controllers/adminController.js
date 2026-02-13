import Athlete from "../models/Athlete.js";
import { v4 as uuidv4 } from "uuid";

export const createAthlete = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const token = uuidv4();

    const athlete = await Athlete.create({
      name,
      token,
      status: "not_started",
      checkpoints: []
    });

    res.json({
      message: "Athlete created",
      token: athlete.token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

// 🔥 Reusable function for sockets
export const generateLiveData = async () => {
  const athletes = await Athlete.find();
  const now = new Date();

  const running = [];
  const notStarted = [];
  const finished = [];

  athletes.forEach((athlete) => {

    if (athlete.status === "running") {
      running.push({
        name: athlete.name,
        id: athlete._id,  // ✅ ADD THIS
        startedAt: athlete.startTime,
        duration: formatDuration(now - athlete.startTime),
        lastCheckpoint:
          athlete.checkpoints.length > 0
            ? athlete.checkpoints[athlete.checkpoints.length - 1].checkpointId
            : 0
      });
    }

    else if (athlete.status === "not_started") {
      notStarted.push({
        name: athlete.name,
        id: athlete._id,  // ✅ ADD THIS    
      });
    }

    else if (athlete.status === "finished") {
      finished.push({
        name: athlete.name,
        id: athlete._id,  // ✅ ADD THIS
        totalTime: athlete.totalTime
      });
    }

  });

  return { running, notStarted, finished };
};



// 🌐 HTTP route controller
export const getLiveDashboard = async (req, res) => {
  try {
    const data = await generateLiveData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete athlete - for admin panel
export const deleteAthlete = async (req, res) => {
  try {
    const { id } = req.params;

    await Athlete.deleteOne({ _id: id });

    const updatedData = await generateLiveData();
    req.io.emit("adminLiveUpdate", updatedData);

    // 🔥 Update leaderboard properly
    const finishedAthletes = await Athlete.find({
      status: "finished"
    }).sort({ totalTime: 1 });

    const leaderboard = finishedAthletes.map((a, index) => ({
      rank: index + 1,
      name: a.name,
      totalTime: `${Math.floor(a.totalTime / 1000)}s`
    }));

    req.io.emit("leaderboardLiveUpdate", leaderboard);

    res.json({ message: "Athlete deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const retakeAthlete = async (req, res) => {
  try {
    const { id } = req.params;

    const athlete = await Athlete.findById(id);

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    athlete.status = "not_started";
    athlete.checkpoints = [];
    athlete.startTime = null;
    athlete.finishTime = null;
    athlete.totalTime = null;

    await athlete.save();

    const updatedData = await generateLiveData();
    req.io.emit("adminLiveUpdate", updatedData);

    res.json({ message: "Athlete ready for retake" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetRunningAthletes = async (req, res) => {
  try {
    await Athlete.updateMany(
      { status: "running" },   // only running athletes
      {
        status: "not_started",
        checkpoints: [],
        startTime: null,
        finishTime: null,
        totalTime: null
      }
    );

    const updatedData = await generateLiveData();
    req.io.emit("adminLiveUpdate", updatedData);

    res.json({ message: "Running athletes reset" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


