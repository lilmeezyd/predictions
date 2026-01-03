import asyncHandler from "express-async-handler";
import Matchday from "../models/matchdayModel.js";
import Fixture from "../models/fixtureModel.js";
import Prediction from "../models/predictionModel.js";
import User from "../models/userModel.js";

export const makePredictions = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const {
    matchday,
    fixture,
    teamHome,
    teamAway,
    homePrediction,
    awayPrediction,
  } = req.body;

  if (
    !matchday ||
    !fixture ||
    !teamHome ||
    !teamAway ||
    homePrediction === null ||
    awayPrediction === null ||
    homePrediction === undefined ||
    awayPrediction === undefined
  ) {
    res.status(400);
    throw new Error("Some details are missing");
  }

  const fixtureStatus = await Fixture.findById(fixture);
  if (!fixtureStatus) {
    res.status(404);
    throw new Error("Fixture not found");
  }

  if (fixtureStatus.live) {
    res.status(400);
    throw new Error("This fixture has already started");
  }

  if (fixtureStatus.finished) {
    res.status(400);
    throw new Error("This fixture has already ended");
  }

  const prediction = await Prediction.findOneAndUpdate(
    {
      player: req.user.id,
      fixture,
      matchday,
    },
    {
      $set: {
        matchday,
        fixture,
        player: req.user.id,
        teamHome,
        teamAway,
        homePrediction,
        awayPrediction,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "Prediction saved",
    prediction,
  });
});

export const getPredictionsByPlayer = asyncHandler(async (req, res) => {
  const player = await User.findById(req.params.id);
  const matchday = await Matchday.findOne({
    matchdayId: parseInt(req.params.mid),
  });
  if (!player) {
    throw new Error("Player not found");
  }
  if (!matchday) {
    throw new Error("Matchday not found");
  }
  const { _id } = matchday;
  const predictions = await Prediction.find({
    player: req.params.id,
    matchday: _id,
    $or: [{ live: true }, { finished: true }],
  })
    .populate("player", "firstName lastName")
    .populate("matchday", "matchdayId")
    .populate("fixture", "finished live kickOffTime")
    .populate("teamAway", "name shortName")
    .populate("teamHome", "name shortName");

  res.json(predictions);
});

export const getMyPredictions = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const { mid, fid } = req.params;

  if (!mid || !fid) {
    res.status(400);
    throw new Error("Missing matchday or fixture");
  }

  const prediction = await Prediction.findOne({
    player: req.user.id,
    matchday: mid,
    fixture: fid,
  });

  if (!prediction) {
    res.status(404);
    throw new Error("Prediction not found");
  }

  res.status(200).json(prediction);
});

export const predictionMadeTheMost = asyncHandler(async (req, res) => {
  const matchday = await Matchday.findOne({ current: true });
  const matchdayId = matchday ? matchday?._id : 1;
  const result = await Prediction.aggregate([
    { $match: { matchday: matchdayId } },
    {
      $group: {
        _id: {
          fixture: "$fixture",
          home: "$homePrediction",
          away: "$awayPrediction",
        },
        count: { $sum: 1 },
      },
    },
    {
      $setWindowFields: {
        output: {
          totalPredictions: {
            $sum: "$count",
            window: {},
          },
        },
      },
    },
    {
      $addFields: {
        percentage: {
          $round: [
            {
              $multiply: [{ $divide: ["$count", "$totalPredictions"] }, 100],
            },
            2,
          ],
        },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: "fixtures", // Mongo collection name
        localField: "_id.fixture",
        foreignField: "_id",
        as: "fixture",
      },
    },
    {
      $unwind: "$fixture",
    },
    {
      $addFields: {
        score: {
          $concat: [
            { $toString: "$_id.home" },
            "-",
            { $toString: "$_id.away" },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        fixture: 1,
        score: 1,
        count: 1,
        totalPredictions: 1,
        percentage: 1,
      },
    },
  ]);
  console.log(result.length);
  res.json(result);
});

export const predictionMadeTheLeast = asyncHandler(async (req, res) => {
  const matchday = await Matchday.findOne({ current: true });
  const matchdayId = matchday ? matchday?._id : 1;
  const result = await Prediction.aggregate([
    { $match: { matchday: matchdayId } },
    {
      $group: {
        _id: {
          fixture: "$fixture",
          home: "$homePrediction",
          away: "$awayPrediction",
        },
        count: { $sum: 1 },
      },
    },
    {
      $setWindowFields: {
        output: {
          totalPredictions: {
            $sum: "$count",
            window: {},
          },
        },
      },
    },
    {
      $addFields: {
        percentage: {
          $round: [
            {
              $multiply: [{ $divide: ["$count", "$totalPredictions"] }, 100],
            },
            2,
          ],
        },
      },
    },
    {
      $sort: { count: 1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: "fixtures", // Mongo collection name
        localField: "_id.fixture",
        foreignField: "_id",
        as: "fixture",
      },
    },
    {
      $unwind: "$fixture",
    },
    {
      $addFields: {
        score: {
          $concat: [
            { $toString: "$_id.home" },
            "-",
            { $toString: "$_id.away" },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        fixture: 1,
        score: 1,
        count: 1,
        totalPredictions: 1,
        percentage: 1,
      },
    },
  ]);
  console.log(result.length);
  res.json(result);
});

export const predictionPercentages = asyncHandler(async (req, res) => {});
