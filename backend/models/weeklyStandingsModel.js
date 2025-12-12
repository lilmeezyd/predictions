import mongoose from "mongoose";

const weeklySchema = mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    points: { type: Number, default: null}
})

const Weekly = mongoose.model("Weekly", weeklySchema)
export default Weekly