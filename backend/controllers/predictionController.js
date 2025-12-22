import asyncHandler from "express-async-handler";
import Matchday from "../models/matchdayModel.js";
import Fixture from "../models/fixtureModel.js";
import Prediction from "../models/predictionModel.js";

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


export const getPredictionsByPlayer = asyncHandler(async (req, res) => {})

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

