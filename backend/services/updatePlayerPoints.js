import asyncHandler from "express-async-handler";
import Prediction from "../models/predictionModel.js";
import { updateWeeklyStandings } from ".//updateWeeklyStandings.js";

export const updatePlayerPoints = asyncHandler(
  async (fixtureId, matchday, teamAwayScore, teamHomeScore, teamAway, teamHome) => {
    /*const playersWithPrediction = await Prediction.updateMany({fixture: fixtureId}, 
        {$set: {teamHomeScore: teamHomeScore, teamAwayScore: teamAwayScore}})*/
    const playersWithPrediction = await Prediction.find({
      fixture: fixtureId,
    }).lean();
    const result =
      teamAwayScore === teamHomeScore
        ? "draw"
        : teamHomeScore > teamAwayScore
        ? "homeWin"
        : "awayWin";
    const bulkOps = [];
    for (const player of playersWithPrediction) {
      let points;
      const playerResult =
        player.awayPrediction === player.homePrediction
          ? "draw"
          : player.homePrediction > player.awayPrediction
          ? "homeWin"
          : "awayWin";

      if (result === playerResult) {
        if (
          teamHomeScore === player.homePrediction &&
          teamAwayScore === player.awayPrediction
        ) {
          points = 5;
        } else {
          points = 2;
        }
      } else {
        points = 0;
      }

      bulkOps.push({
        updateOne: {
            filter: { fixture: fixtureId, player: player.player},
            update: {
                $set: {
                    predictionPoints: points,
                    teamHomeScore: teamHomeScore,
                    teamAwayScore: teamAwayScore
                }
            }
        }
      })
    }

    if(bulkOps.length > 0) {
        await Prediction.bulkWrite(bulkOps)
    }
    await updateWeeklyStandings(matchday);
  }
);
