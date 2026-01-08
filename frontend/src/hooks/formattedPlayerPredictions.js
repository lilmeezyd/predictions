import { useMemo } from "react";

function formattedPlayerPredictions(predictions) {
  return useMemo(() => {
    const yourPredictions = [...predictions]
    const newPredictions = yourPredictions.map((x) => {
      return {
        _id: x?._id,
        awayPrediction: x?.awayPrediction,
        live: x?.fixture?.live,
        finished: x?.fixture?.finished,
        kickOffTime: x?.fixture?.kickOffTime,
        fixtureId: x?.fixture?._id,
        homePrediction: x?.homePrediction,
        matchdayId: x?.matchday?.matchdayId,
        player: x?.player,
        predictionPoints: x?.predictionPoints,
        teamAwayName: x?.teamAway?.name,
        teamAwayShort: x?.teamAway?.shortName,
        teamAwayScore: x?.teamAwayScore,
        teamHomeName: x?.teamHome?.name,
        teamHomeShort: x?.teamHome?.shortName,
        teamHomeScore: x?.teamHomeScore,
      };
    }).sort((x, y) => {
        if (x.kickOffTime !== y.kickOffTime) {
          return x.kickOffTime > y.kickOffTime ? 1 : -1;
        }
        return x?.teamHomeName?.localeCompare(y?.teamHomeName);
      });
    return newPredictions
  }, [predictions]);
}

function formattedPlayerName(singleUser) {

  const { firstName, lastName } = singleUser || {};
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

function totalPoints(predictions) {
return predictions.reduce((x,y) => x+y.predictionPoints, 0)
}


export { formattedPlayerPredictions, formattedPlayerName, totalPoints }
