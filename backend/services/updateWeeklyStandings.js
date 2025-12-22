import asyncHandler from "express-async-handler";
import { updateOverallStandings } from "./updateOverallStandings.js";
import Matchday from "../models/matchdayModel.js";
import Prediction from "../models/predictionModel.js";
import Weekly from "../models/weeklyStandingsModel.js";

export const updateWeeklyStandings = asyncHandler(async (matchday) => {
  const matchdayWeek = await Matchday.findOne({ _id: matchday });
  if (matchdayWeek) {
    const { _id } = matchdayWeek;
    await Prediction.aggregate([
      { $match: { matchday: _id } },
      {
        $group: {
          _id: {
            player: "$player",
            matchday: "$matchday",
          },
          points: { $sum: "$predictionPoints" },
        },
      },
      {
        $project: {
          _id: 0,
          player: "$_id.player",
          matchday: "$_id.matchday",
          points: 1,
        },
      },
      {
        $sort: { points: -1, player: 1 },
      },
      {
        $setWindowFields: {
          sortBy: { points: -1, player: 1 },
          output: {
            rank: {
              $rank: {},
            },
          },
        },
      },
      {
        $merge: {
          into: "weeklies",
          on: ["player", "matchday"],
          whenMatched: "replace",
          whenNotMatched: "insert",
        },
      },
    ]);
  }
  await updateOverallStandings();
});
