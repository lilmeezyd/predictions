import mongoose from "mongoose";

const matchdaySchema = mongoose.Schema({
  matchdayId: { type: Number, required: true, unique: true },
  name: { type: String, required: [true, "Add required field"] },
  deadline: { type: Date, default: null },
  current: { type: Boolean, default: false },
  finished: { type: Boolean, default: false}
}, {timestamps: true});

const Matchday = mongoose.model("Matchday", matchdaySchema);
export default Matchday;
