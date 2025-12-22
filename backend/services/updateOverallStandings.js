import asyncHandler from "express-async-handler";
import Weekly from "../models/weeklyStandingsModel.js";

export const updateOverallStandings = asyncHandler(async () => {
  await Weekly.aggregate([
    { $group: { _id: { player: "$player" }, points: { $sum: "$points" } } },
    { $project: { _id: 0, player: "$_id.player", points: 1 } },
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
        into: "overalls",
        on: ["player"],
        whenMatched: "replace",
        whenNotMatched: "insert",
      },
    },
  ]);
});
