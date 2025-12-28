import { Link, useParams } from "react-router-dom";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { useGetCurrentMatchdayQuery } from "../slices/matchdayApiSlice";
const TableDisplay = ({ data, userInfo }) => {
  const { data: matchdayIdObj = {} } = useGetCurrentMatchdayQuery();
  if (!data || data.length === 0)
    return (
      <div className="font-semibold m-auto" style={{ maxWidth: "700px" }}>
        No data
      </div>
    );
  return (
    <div
      className="border border-gray-400 m-auto"
      style={{ maxWidth: "700px" }}
    >
      <div className="standing-grid-1 text-sm standing-grid-header">
        <div></div>
        <div>Rank</div>
        <div className="standing-grid-name">Name</div>
        <div>Points</div>
      </div>
      {data.map((entry) => (
        <div
          style={{
            background: `${
              userInfo._id.toString() === entry.playerId.toString()
                ? "#ffd70063"
                : "white"
            }`,
          }}
          className="standing-grid-1  text-sm"
          key={entry.playerId}
        >
          <div>
            {entry.oldRank > entry.rank && entry.oldRank > 0 && (
              <ArrowUp color="green" size={16} />
            )}
            {(entry.oldRank === entry.rank || entry.oldRank === 0) && (
              <ArrowRight color="gray" size={16} />
            )}
            {entry.oldRank < entry.rank && entry.oldRank > 0 && (
              <ArrowDown color="red" size={16} />
            )}
          </div>
          <div>{entry.rank}</div>
          <div>
            <Link
              to={`${
                userInfo.roles.ADMIN ?
                `/admin/players/${entry.playerId}/matchday/${matchdayIdObj.matchday}` : 
                userInfo?._id?.toString() === entry?.playerId?.toString() ?  
                `/predictions/selections`:
                `/predictions/players/${entry.playerId}/matchday/${matchdayIdObj.matchday}`
              }`}
            >
              {entry.firstName}&nbsp;&nbsp;{entry.lastName}
            </Link>
          </div>
          <div>{entry.points}</div>
        </div>
      ))}
    </div>
  );
};

export default TableDisplay;
