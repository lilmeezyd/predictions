import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add team name"],
  },
  shortName: {
    type: String,
    required: [true, "Please add short format of team name"],
  },
},{ timestamps: true });

const Team = mongoose.model("Team", teamSchema);
export default Team;
