import mongoose from "mongoose";

const athleteSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,

  token: {
    type: String,
    unique: true
  },

  startTime: Date,
  finishTime: Date,

  checkpoints: [
    {
      checkpointId: Number,
      time: Date
    }
  ],

  attempts: [
    {
      totalTime: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  totalTime: Number,

  status: {
    type: String,
    enum: ["not_started", "running", "finished"],
    default: "not_started"
  }

}, { timestamps: true });

export default mongoose.model("Athlete", athleteSchema);
