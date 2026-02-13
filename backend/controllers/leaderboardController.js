import Athlete from "../models/Athlete.js";
import { Parser } from "json2csv";

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
    const athletes = await Athlete.find();

    const leaderboard = athletes
      .filter(a => a.attempts && a.attempts.length > 0)
      .map(a => {
        const bestTime = Math.min(
          ...a.attempts.map(attempt => attempt.totalTime)
        );

        return {
          name: a.name,
          token: a.token,
          bestTime
        };
      })
      .sort((a, b) => a.bestTime - b.bestTime)
      .map((a, index) => ({
        rank: index + 1,
        name: a.name,
        token: a.token,
        totalTime: `${Math.floor(a.bestTime / 1000)}s`
      }));

    res.json(leaderboard);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const exportLeaderboardCSV = async (req, res) => {
  try {
    const athletes = await Athlete.find({
      status: "finished"
    }).sort({ totalTime: 1 });

    const data = athletes.map((athlete, index) => ({
      Rank: index + 1,
      Name: athlete.name,
      TotalTime: formatTime(athlete.totalTime)
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("leaderboard.csv");
    res.send(csv);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

