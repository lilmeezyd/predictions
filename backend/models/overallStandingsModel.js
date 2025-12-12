import mongoose from "mongoose";

const overallSchema = mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  points: { type: Number, default: null },
}, {tiemstamps: true});

const Overall = mongoose.model("Overall", overallSchema);
export default Overall;
