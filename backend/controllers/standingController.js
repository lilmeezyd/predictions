import asyncHandler from "express-async-handler";
import Overall from "../models/overallStandingsModel.js";
import Weekly from "../models/weeklyStandingsModel.js";
import Matchday from "../models/matchdayModel.js";

export const getOverallTable = asyncHandler(async (req, res) => {
  const table = await Overall.find({}).populate({
    path: "player",
    select: "firstName lastName",
  });
  res.json(table);
});

export const getWeeklyTables = asyncHandler(async (req, res) => {
  const tables = await Weekly.find({}).populate({
    path: "player",
    select: "firstName lastName",
  });
  res.json(tables);
});

export const getSingleWeeklyTable = asyncHandler(async (req, res) => {
  const table = await Weekly.find({ matchday: req.params.id }).populate({
    path: "player",
    select: "firstName lastName",
  });
  res.json(table);
});

export const getHighestScoringEntrant = asyncHandler(async (req, res) => {
  const matchday = await Matchday.findOne({ current: true });
  const matchdayId = matchday ? matchday._id : 1;
  const entrants = await Weekly.find({
    matchday: matchdayId,
    rank: 1,
  }).populate({path: "player", select: "firstName lastName"});
  res.json(entrants);
});
