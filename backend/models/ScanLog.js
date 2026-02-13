import mongoose from "mongoose";

const scanLogSchema = new mongoose.Schema({
  athleteToken: String,
  checkpointId: Number,
  scannedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ScanLog", scanLogSchema);
