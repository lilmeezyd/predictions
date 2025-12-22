import mongoose from "mongoose";

const predictionSchema = ({
    matchday: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Matchday"},
    fixture: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Fixture"},
    player: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    teamHome: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Team"},
    teamAway: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Team"},
    homePrediction: { type: Number, default: null},
    awayPrediction: { type: Number, default: null},
    teamHomeScore: { type: Number, default: null},
    teamAwayScore: { type: Number, default: null},
    predictionPoints: { type: Number, default: null}
});

const Prediction = mongoose.model("Prediction", predictionSchema)
export default Prediction; 