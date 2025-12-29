import { useState, useEffect } from "react";
import {
  useMakePredictionsMutation,
  useGetMyPredictionsQuery,
} from "../slices/predictionApiSlice";
import { useSelector } from "react-redux";
import { CircleCheck, LoaderCircle, CircleX } from "lucide-react";
import { toast } from "sonner";

const PredictionItem = (props) => {
  const { fixture } = props;
  const { userInfo } = useSelector((state) => state.auth);
  const [makePredictions, { isLoading }] = useMakePredictionsMutation();
  const { data } = useGetMyPredictionsQuery({
    id: userInfo?._id,
    mid: fixture?.matchdayId,
    fid: fixture?._id,
  });
  const [scores, setScroes] = useState({
    homePrediction: undefined,
    awayPrediction: undefined,
  });
  const { awayPrediction, homePrediction } = scores;

  useEffect(() => {
    setScroes({
      homePrediction: !data ? undefined : data?.homePrediction,
      awayPrediction: !data ? undefined : data?.awayPrediction,
    });
  }, [data]);
  const addToScores = (turf) => {
    if (turf === "home") {
      if (homePrediction === undefined) {
        setScroes((prev) => ({
          ...prev,
          homePrediction: 0,
        }));
      } else {
        setScroes((prev) => ({
          ...prev,
          homePrediction: prev.homePrediction++,
        }));
      }
    } else {
      if (awayPrediction === undefined) {
        setScroes((prev) => ({
          ...prev,
          awayPrediction: 0,
        }));
      } else {
        setScroes((prev) => ({
          ...prev,
          awayPrediction: prev.awayPrediction++,
        }));
      }
    }
  };
  const subtractFromScores = (turf) => {
    if (turf === "home") {
      if (homePrediction > 0) {
        setScroes((prev) => ({
          ...prev,
          homePrediction: prev.homePrediction--,
        }));
      }
      if (homePrediction === undefined) {
        setScroes((prev) => ({
          ...prev,
          homePrediction: 0,
        }));
      }
    } else {
      if (awayPrediction > 0) {
        setScroes((prev) => ({
          ...prev,
          awayPrediction: prev.awayPrediction--,
        }));
      }

      if (awayPrediction === undefined) {
        setScroes((prev) => ({
          ...prev,
          awayPrediction: 0,
        }));
      }
    }
  };

  const savePrediction = async () => {
    const isValid =
      homePrediction !== undefined &&
      awayPrediction !== undefined &&
      homePrediction !== null &&
      awayPrediction !== null && 
      (homePrediction !== data?.homePrediction || 
      awayPrediction !== data?.awayPrediction);
      if(!isValid) {
        toast.error("No changes detected")
        return;
      }
    try {
      const res = await makePredictions({
        matchday: fixture?.matchdayId,
        fixture: fixture?._id,
        teamHome: fixture?.teamHomeId,
        teamAway: fixture?.teamAwayId,
        homePrediction,
        awayPrediction,
      }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // run automatically when both predictions are valid
 useEffect(() => {
    const isValid =
      homePrediction !== undefined &&
      awayPrediction !== undefined &&
      homePrediction !== null &&
      awayPrediction !== null && 
      (homePrediction !== data?.homePrediction || 
      awayPrediction !== data?.awayPrediction);
    if (isValid) {
      savePrediction();
    }
  }, [data, homePrediction, awayPrediction]);

  const newDate = new Date(fixture.kickOffTime);
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
          {new Date(fixture.kickOffTime).toLocaleDateString()}
        </div>
        <div
          className="grid grid-cols-[35%_30%_35%]
                    sm:grid-cols-[40%_20%_40%]
                    items-center p-4 relative"
        >
          <div className="text-xs sm:text-base py-2 px-1 sm:px-4 font-semibold flex flex-col-reverse sm:flex-row justify-between">
            <div className="my-auto truncate text-center sm:text-right w-full sm:w-3/4 px-2">
              {fixture.teamHome}
            </div>
            <div className="w-full sm:w-1/4  flex justify-center align-center">
              <img
                src={`https://ik.imagekit.io/cap10/${fixture.shortHome}.webp`}
                alt={`${fixture.teamHome} badge`}
                className="h-10 w-10 md:h-20 md:w-20 object-contain rounded"
              />
            </div>
          </div>
          <div
            className={`
                     font-bold text-xs sm:text-base rounded-lg flex p-2 relative`}
          >
            <div className="text-center my-auto mr-1 border border-gray-400 flex-grow rounded-lg">
              {fixture?.live === false && fixture?.finished === false && <div className="border-b border-gray-400">
                <button className="w-full" onClick={() => addToScores("home")}>
                  +
                </button>
              </div>}
              <div className="bg-gray-900 text-white">{homePrediction === undefined ? "?" : homePrediction}</div>
              {fixture?.live === false && fixture?.finished === false && <div className="border-t border-gray-400">
                <button
                  className="w-full"
                  onClick={() => subtractFromScores("home")}
                >
                  -
                </button>
              </div>}
            </div>
            {data?.homePrediction !== undefined &&
              data?.awayPrediction !== undefined && (
                <div className="absolute z-5 saved-picks">
                  <CircleCheck color="green" size={24} />
                </div>
              )}
            <div className="text-center ml-1 border border-gray-400 flex-grow rounded-lg">
              {fixture?.live === false && fixture?.finished === false && <div className="border-b border-gray-400">
                <button className="w-full" onClick={() => addToScores("away")}>
                  +
                </button>
              </div>}
              <div className="bg-gray-900 text-white">{awayPrediction === undefined ? "?" : awayPrediction}</div>
              {fixture?.live === false && fixture?.finished === false && <div className="border-t border-gray-400">
                <button
                  className="w-full"
                  onClick={() => subtractFromScores("away")}
                >
                  -
                </button>
              </div>}
            </div>
          </div>
          <div className="text-xs sm:text-base py-2 px-1 sm:px-4 font-semibold flex flex-col sm:flex-row justify-between">
            <div className="w-full sm:w-1/4 flex justify-center align-center">
              <img
                src={`https://ik.imagekit.io/cap10/${fixture.shortAway}.webp`}
                alt={`${fixture.teamAway} badge`}
                className="h-10 w-10 md:h-20 md:w-20 object-contain rounded"
              />
            </div>
            <div className="my-auto truncate text-center sm:text-left w-full sm:w-3/4 px-2">
              {fixture.teamAway}
            </div>
          </div>
          {fixture?.live === false && fixture?.finished === false && <button
            className="bg-blue-600 text-white rounded px-3 py-1 absolute save-button text-xs"
            onClick={savePrediction}
          >
            {isLoading ? <LoaderCircle size={24} /> : "Save"}
          </button>}
        </div>
        <div className="pt-1 flex justify-between items-center">
          <div className="text-center text-sm font-semibold w-1/3 p-1">
            <div>Score</div>
            <div className="m-auto flex justify-around w-3/5 p-1">
              <div>{fixture?.teamHomeScore ?? "-"}</div>
              <div>:</div>
              <div>{fixture?.teamAwayScore ?? "-"}</div>
            </div>
          </div>
          <div className="w-1/3 p-1">
            {fixture.live && (
              <p className="text-center text-xs sm:text-base text-red-500 font-semibold p-1">
                Live
              </p>
            )}
            {fixture.finished && (
              <p className="text-center text-xs sm:text-base font-semibold p-1">
                Finished
              </p>
            )}
          </div>
          <div className="text-center text-sm font-semibold w-1/3 p-1">
            <div>Points</div>
            <div className="m-auto w-3/5 p-1">
              {data?.predictionPoints ?? "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionItem;
