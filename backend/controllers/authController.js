import Athlete from "../models/Athlete.js";
import jwt from "jsonwebtoken";

export const loginAthlete = async (req, res) => {
  try {
    const { token } = req.body;

    const athlete = await Athlete.findOne({ token });

    if (!athlete) {
      return res.status(404).json({
        success: false,
        message: "Invalid token"
      });
    }

    const jwtToken = jwt.sign(
      { id: athlete._id },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.json({
      success: true,
      name: athlete.name,
      status: athlete.status,
      token: jwtToken
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAthleteStatus = async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.user.id);

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    res.json({
      name: athlete.name,
      status: athlete.status,
      checkpointsCompleted: athlete.checkpoints.length,
      totalTime: athlete.totalTime
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
