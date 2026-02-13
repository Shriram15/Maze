import Athlete from "../models/Athlete.js";

export const validateToken = async (req, res) => {
  try {
    const { token } = req.body;

    const athlete = await Athlete.findOne({ token });

    if (!athlete) {
      return res.status(404).json({
        valid: false,
        message: "Invalid token"
      });
    }

    res.json({
      valid: true,
      name: athlete.name,
      status: athlete.status
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAthleteStatus = async (req, res) => {
  try {
    const { token } = req.query;

    const athlete = await Athlete.findOne({ token });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    res.json({
      name: athlete.name,
      status: athlete.status,
      startTime: athlete.startTime,
      finishTime: athlete.finishTime,
      checkpointsCompleted: athlete.checkpoints.length,
      totalTime: athlete.totalTime
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
