import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, ArrowRightCircle } from "lucide-react";
import { useGetCurrentMatchdayQuery } from "../slices/matchdayApiSlice";
const TableDisplay = ({ data, userInfo }) => {
  const { data: matchdayIdObj = {} } = useGetCurrentMatchdayQuery();
   const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
  
  const paginatedData = data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if (!data || data.length === 0)
    return (
      <div className="font-semibold m-auto" style={{ maxWidth: "700px" }}>
        No data
      </div>
    );
  return (
    <>
    <div
      className="border border-gray-100 rounded-lg m-auto fixture-housing"
      style={{ maxWidth: "700px" }}
    >
      <div className="standing-grid-1 text-sm standing-grid-header">
        <div></div>
        <div>Rank</div>
        <div className="standing-grid-name">Name</div>
        <div>Points</div>
      </div>
      {paginatedData?.map((entry) => (
        <div
          style={{
            background: `${
              userInfo?._id?.toString() === entry?.playerId?.toString()
                ? "#ffd70063"
                : "white"
            }`,
          }}
          className="standing-grid-1  text-sm"
          key={entry.playerId}
        >
          <div className="font-bold w-full flex items-center justify-center">
            <div>
              {entry.oldRank > entry.rank && entry.oldRank > 0 && (
                <ArrowUpCircle className="text-green-500" size={16} />
              )}
              {(entry.oldRank === entry.rank || entry.oldRank === 0) && (
                <ArrowRightCircle className="text-gray-500" size={16} />
              )}
              {entry.oldRank < entry.rank && entry.oldRank > 0 && (
                <ArrowDownCircle className="text-red-500" size={16} />
              )}
            </div>
            <div
              className={`ml-1 font-bold text-xs ${
                entry.oldRank > 0 ? (entry.oldRank < entry.rank
                  ? "text-red-500"
                  : entry.oldRank > entry.rank
                  ? `text-green-500`
                  : "text-gray-500") : "text-gray-500"
              }`}
            >
              {entry.oldRank > 0 ? (entry.oldRank < entry.rank
                ? entry.oldRank - entry.rank
                : (entry.oldRank > entry.rank)
                ? `+${entry.oldRank - entry.rank}`
                : "=") : "="}
            </div>
          </div>
          <div>{entry.rank}</div>
          <div className="truncate">
            <Link
              to={`${
                userInfo.roles.ADMIN
                  ? `/admin/players/${entry.playerId}/matchday/${matchdayIdObj.matchday}`
                  : userInfo?._id?.toString() === entry?.playerId?.toString()
                  ? `/predictions/selections`
                  : `/predictions/players/${entry.playerId}/matchday/${matchdayIdObj.matchday}`
              }`}
            >
              {entry.firstName}&nbsp;&nbsp;{entry.lastName}
            </Link>
          </div>
          <div>{entry.points}</div>
        </div>
      ))}
    </div>
     <div className="flex justify-center mt-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </Button>
      <span className="text-sm px-2 py-1">Page {currentPage} of {totalPages}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
    </>
  );
};

export default TableDisplay;
