import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetPredictionsByPlayerQuery } from "../slices/predictionApiSlice";
import {
  useGetCurrentMatchdayQuery,
  useGetMatchdayMaxNMinQuery,
} from "../slices/matchdayApiSlice";
import { useGetSingleUserQuery } from "../slices/userApiSlice";
import {
  formattedPlayerPredictions,
  formattedPlayerName,
} from "../hooks/formattedPlayerPredictions";
import PlayerPredictionsItem from "../components/PlayerPredictionsItem";
import { Button } from "../../@/components/ui/button";

const PlayerPredictions = () => {
  const { id, mid } = useParams();
  const matchday = Number(mid);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: matchdayData = {} } = useGetCurrentMatchdayQuery();
  const { data: minMaxData = {} } = useGetMatchdayMaxNMinQuery();
  const { data: predictions = [], isLoading } = useGetPredictionsByPlayerQuery({
    id,
    mid,
  });

  const { data: singleUser = {} } = useGetSingleUserQuery(id);

  const min = minMaxData?.min;
  const max = matchdayData?.matchday;

  const playerPredictions = formattedPlayerPredictions(predictions);
  const playerName = formattedPlayerName(singleUser);
  const possessiveName = playerName?.endsWith("s")
    ? `${playerName}'`
    : `${playerName}'s`;

  const navigateToMatchday = (day) => {
    const base = userInfo?.roles?.ADMIN ? "/admin" : "/predictions";
    navigate(`${base}/players/${id}/matchday/${day}`);
  };

  if (isLoading) {
    return <div className="text-center py-4 font-semibold">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1">
      <h1 className="text-center font-bold my-2 py-2 bg-gray-900 text-white rounded">
        Matchday {matchday}
      </h1>

      <p className="text-center text-sm mb-3">
        You're viewing <span className="font-semibold">{possessiveName}</span>{" "}
        predictions
      </p>

      {playerPredictions.length === 0 ? (
        <div className="text-center font-semibold">No data available</div>
      ) : (
        playerPredictions.map((prediction) => (
          <PlayerPredictionsItem key={prediction._id} prediction={prediction} />
        ))
      )}

      {max > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <Button
            type="button"
            disabled={matchday <= min}
            onClick={() => navigateToMatchday(matchday - 1)}
            variant="outline"
            size="sm"
          >
            Prev
          </Button>

          <span className="text-sm">Matchday {matchday}</span>

          <Button
            disabled={matchday >= max}
            onClick={() => navigateToMatchday(matchday + 1)}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayerPredictions;
