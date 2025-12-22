import mongoose from "mongoose";

const overallSchema = mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    points: { type: Number, default: null },
    rank: {
      type: Number,
      index: true,
    },
  },
  { timestamps: true }
);

overallSchema.index({ player: 1 }, { unique: true });
const Overall = mongoose.model("Overall", overallSchema);
export default Overall;
