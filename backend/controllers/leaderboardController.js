import Athlete from "../models/Athlete.js";

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const getLeaderboard = async (req, res) => {
  try {
    const athletes = await Athlete.find({
      status: "finished"
    }).sort({ totalTime: 1 });

    const leaderboard = athletes.map((athlete, index) => ({
      rank: index + 1,
      name: athlete.name,
      totalTime: formatTime(athlete.totalTime),
      rawTime: athlete.totalTime,
      splits: athlete.checkpoints.map(cp => ({
        checkpoint: cp.checkpointId,
        time: cp.time
      }))
    }));

    res.json(leaderboard);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
