import mongoose from "mongoose";

const weeklySchema = mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
  points: { type: Number, default: null },
  matchday: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  rank: {
    type: Number,
    index: true,
  },
});

weeklySchema.index({ player: 1, matchday: 1 }, { unique: true });
const Weekly = mongoose.model("Weekly", weeklySchema);
export default Weekly;
