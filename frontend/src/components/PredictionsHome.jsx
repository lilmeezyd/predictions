import React from "react";
import { Link } from "react-router-dom";
import { useGetHighestScoringEntrantQuery } from "../slices/tableApiSlice";
import { useGetCurrentMatchdayQuery } from "../slices/matchdayApiSlice";
import { usePredictionMadeTheMostQuery, usePredictionMadeTheLeastQuery } from "../slices/predictionApiSlice";
import { useSelector } from "react-redux";
import highestEntrant from "../hooks/formattedHighestEntrant";
import predictFormat from "../hooks/predictFormat";

const PredictionsHome = () => { 
  const { userInfo } = useSelector((state) => state.auth);
  const { data = [], isLoading } = useGetHighestScoringEntrantQuery();
  const { data: matchdayIdObj = {} } = useGetCurrentMatchdayQuery();
  const { data: mostPrediction = [], isLoading: predictLoading } =
    usePredictionMadeTheMostQuery();
    const { data: leastPrediction = [], isLoading: predictLeastLoading } =
    usePredictionMadeTheLeastQuery();
  const entrants = highestEntrant(data);
  const mostPredictionFormatted = predictFormat(mostPrediction);
  const leastPredictionFormatted = predictFormat(leastPrediction);
  return (
    <div>
      <h1 className="font-bold">Matchday Statistics</h1>
      <div className="home-section py-2">
        <div className="p-2 home-section-sub fixture-housing rounded">
          <div>
            <h4 className="p-2 font-bold border-b">Top Scoring Manager(s)</h4>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {entrants?.length > 0 ? (
                  entrants?.map((entrant) => (
                    <div
                      className="p-2 flex w-full justify-between items-center"
                      key={entrant.playerId}
                    >
                      <div className="font-semibold">
                        <Link
                          to={`${
                            userInfo.roles.ADMIN
                              ? `/admin/players/${entrant.playerId}/matchday/${matchdayIdObj.matchday}`
                              : userInfo?._id?.toString() ===
                                entrant?.playerId?.toString()
                              ? `/predictions/selections`
                              : `/predictions/players/${entrant.playerId}/matchday/${matchdayIdObj.matchday}`
                          }`}
                        >
                          {entrant.firstName}&nbsp;{entrant.lastName}
                        </Link>
                      </div>
                      <div className="font-bold text-3xl">{entrant.points}</div>
                    </div>
                  ))
                ) : (
                  <div>No data available</div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="p-2 home-section-sub fixture-housing rounded">
          <h4 className="p-2 font-bold border-b">Most Common Prediction</h4>
          {predictLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {mostPredictionFormatted?.length > 0 ? (
                mostPredictionFormatted.map((fixture) => (
                  <div key={fixture._id}>
                    <div
                      className={`grid grid-cols-[35%_30%_35%]
                                        items-center p-4`}
                    >
                      <div className="text-xs py-2 px-1 font-semibold flex flex-col-reverse justify-between">
                        <div className="my-auto truncate text-center w-full px-2">
                          {fixture.teamHome}
                        </div>
                        <div className="w-full flex justify-center align-center">
                          <img
                            src={`https://ik.imagekit.io/cap10/${fixture.shortHome}.webp`}
                            alt={`${fixture.teamHome} badge`}
                            className="h-10 w-10 object-contain rounded"
                          />
                        </div>
                      </div>
                      <div className={`font-bold text-xs rounded flex p-2`}>
                        <div className="text-center my-auto flex-grow text-3xl">
                          {fixture.score}
                        </div>
                      </div>
                      <div className="text-xs py-2 px-1 sm:px-4 font-semibold flex flex-col justify-between">
                        <div className="w-full flex justify-center align-center">
                          <img
                            src={`https://ik.imagekit.io/cap10/${fixture.shortAway}.webp`}
                            alt={`${fixture.teamAway} badge`}
                            className="h-10 w-10 object-contain rounded"
                          />
                        </div>
                        <div className="my-auto truncate text-center w-full px-2">
                          {fixture.teamAway}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold flex justify-center items-center border-t py-2">
                        <div className="px-2">Predicted By:</div>
                        <div className="px-2">{fixture.percentage}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No data available</div>
              )}
            </>
          )}
        </div>

        <div className="p-2 home-section-sub fixture-housing rounded">
          <h4 className="p-2 font-bold border-b">Least Common Prediction</h4>
          {predictLeastLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {leastPredictionFormatted?.length > 0 ? (
                leastPredictionFormatted.map((fixture) => (
                  <div>
                    <div
                      className={`grid grid-cols-[35%_30%_35%]
                                        items-center p-4`}
                    >
                      <div className="text-xs py-2 px-1 font-semibold flex flex-col-reverse justify-between">
                        <div className="my-auto truncate text-center w-full px-2">
                          {fixture.teamHome}
                        </div>
                        <div className="w-full flex justify-center align-center">
                          <img
                            src={`https://ik.imagekit.io/cap10/${fixture.shortHome}.webp`}
                            alt={`${fixture.teamHome} badge`}
                            className="h-10 w-10 object-contain rounded"
                          />
                        </div>
                      </div>
                      <div className={`font-bold text-xs rounded flex p-2`}>
                        <div className="text-center my-auto flex-grow text-3xl">
                          {fixture.score}
                        </div>
                      </div>
                      <div className="text-xs py-2 px-1 sm:px-4 font-semibold flex flex-col justify-between">
                        <div className="w-full flex justify-center align-center">
                          <img
                            src={`https://ik.imagekit.io/cap10/${fixture.shortAway}.webp`}
                            alt={`${fixture.teamAway} badge`}
                            className="h-10 w-10 object-contain rounded"
                          />
                        </div>
                        <div className="my-auto truncate text-center w-full px-2">
                          {fixture.teamAway}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold flex justify-center items-center border-t py-2">
                        <div className="px-2">Predicted By:</div>
                        <div className="px-2">{fixture.percentage}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No data available</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictionsHome
