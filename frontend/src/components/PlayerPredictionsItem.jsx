import { useState, useEffect } from "react";
import {
  useMakePredictionsMutation,
  useGetMyPredictionsQuery,
} from "../slices/predictionApiSlice";
import { useSelector } from "react-redux";
import { CircleCheck, LoaderCircle, CircleX } from "lucide-react";
import { toast } from "sonner";
import { useGetPredictionPercentagesQuery } from "../slices/predictionApiSlice";
import formatPredictionDetails from "../hooks/formatPredictionDetails";

const PlayerPredictionsItem = (props) => {
  const { prediction } = props;
  const { userInfo } = useSelector((state) => state.auth);

  const { data: fixtureDetails = [] } = useGetPredictionPercentagesQuery(
    prediction?.fixtureId
  );
  const newDetails = formatPredictionDetails(fixtureDetails);
  const newDate = new Date(prediction.kickOffTime);
  const newTime = newDate.toLocaleTimeString();
  const time =
    newTime.length === 11
      ? newTime.replace(newTime.substring(5, 10), newTime.substring(8, 10))
      : newTime.replace(newTime.substring(4, 9), newTime.substring(7, 9));

  return (
    <div className="p-2">
      <div className="fixture-housing relative">
        <div className="time-position text-xs font-bold">{time}</div>
        <div className="date-position text-xs font-bold">
          {new Date(prediction.kickOffTime).toLocaleDateString()}
        </div>
        <div
          className="grid grid-cols-[35%_30%_35%]
                    sm:grid-cols-[40%_20%_40%]
                    items-center p-4 relative"
        >
          <div className="text-xs sm:text-base py-2 px-1 sm:px-4 font-semibold flex flex-col-reverse sm:flex-row justify-between">
            <div className="my-auto truncate text-center sm:text-right w-full sm:w-3/4 px-2">
              {prediction.teamHomeName}
            </div>
            <div className="w-full sm:w-1/4  flex justify-center align-center">
              <img
                src={`https://ik.imagekit.io/cap10/${prediction.teamHomeShort}.webp`}
                alt={`${prediction.teamHomeName} badge`}
                className="h-10 w-10 md:h-20 md:w-20 object-contain rounded"
              />
            </div>
          </div>
          <div
            className={`
                     font-bold text-xs sm:text-base rounded-lg flex p-2 relative`}
          >
            <div className="text-center my-auto mr-1 border border-gray-400 flex-grow rounded-lg">
              <div className="bg-gray-900 text-white">
                {prediction.homePrediction === undefined
                  ? "?"
                  : prediction.homePrediction}
              </div>
            </div>
            {prediction?.homePrediction !== undefined &&
              prediction?.awayPrediction !== undefined && (
                <div className="absolute z-5 saved-picks">
                  <CircleCheck color="green" size={24} />
                </div>
              )}
            <div className="text-center ml-1 border border-gray-400 flex-grow rounded-lg">
              <div className="bg-gray-900 text-white">
                {prediction?.awayPrediction === undefined
                  ? "?"
                  : prediction?.awayPrediction}
              </div>
            </div>
          </div>
          <div className="text-xs sm:text-base py-2 px-1 sm:px-4 font-semibold flex flex-col sm:flex-row justify-between">
            <div className="w-full sm:w-1/4 flex justify-center align-center">
              <img
                src={`https://ik.imagekit.io/cap10/${prediction.teamAwayShort}.webp`}
                alt={`${prediction.teamAwayName} badge`}
                className="h-10 w-10 md:h-20 md:w-20 object-contain rounded"
              />
            </div>
            <div className="my-auto truncate text-center sm:text-left w-full sm:w-3/4 px-2">
              {prediction.teamAwayName}
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-center font-semibold text-xs sm:text-sm py-1">
            Predictions Made
          </h4>
          <div className="font-bold text-xs sm:text-sm flex items-center justify-center w-[50%] m-auto">
            <div className="w-1/3 text-center">Home</div>
            <div className="w-1/3 text-center">Draw</div>
            <div className="w-1/3 text-center">Away</div>
          </div>
          <div
            className={`text-xs sm:text-sm border rounded-lg flex items-center justify-center w-[50%] m-auto font-semibold`}
          >
            {newDetails.map((entry, i) => (
              <div
                style={{ background: entry.color }}
                className={`text-xs py-1 w-1/3 text-center`}
                key={entry.outcome}
                id={entry.outcome}
              >
                {`${entry.percentage}%`}
              </div>
            ))}
          </div>
        </div>
        <div className="pt-1 flex justify-between items-center">
          <div className="text-center text-sm font-semibold w-1/3 p-1">
            <div>Score</div>
            <div className="m-auto flex justify-around w-3/5 p-1">
              <div>{prediction?.teamHomeScore ?? "-"}</div>
              <div>:</div>
              <div>{prediction?.teamAwayScore ?? "-"}</div>
            </div>
          </div>
          <div className="w-1/3 p-1">
            {prediction.live && (
              <p className="text-center text-xs sm:text-base text-red-500 font-semibold p-1">
                Live
              </p>
            )}
            {prediction.finished && (
              <p className="text-center text-xs sm:text-base font-semibold p-1">
                Finished
              </p>
            )}
          </div>
          <div className="text-center text-sm font-semibold w-1/3 p-1">
            <div>Points</div>
            <div className="m-auto w-3/5 p-1">
              {prediction?.predictionPoints ?? "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPredictionsItem;
