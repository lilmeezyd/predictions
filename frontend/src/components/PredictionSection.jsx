import { useMemo, useState, useEffect } from "react";
import { useGetFixturesQuery } from "../slices/fixtureApiSlice";
import { useGetTeamsQuery } from "../slices/teamApiSlice";
import {
  useGetMatchdaysQuery,
  useGetCurrentMatchdayQuery,
} from "../slices/matchdayApiSlice";
import fixturesByMatchday from "../hooks/fixturesByMatchday";
import PredictionItem from "./PredictionItem";
import { Button } from "../../@/components/ui/button";
import { useSelector } from "react-redux";
import { createTotalForLoggedInUser } from "../hooks/createTotalForLoggedInUser";

const PredictionSection = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { _id } = userInfo;
  const { data = [], isLoading } = useGetFixturesQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: matchdays = [] } = useGetMatchdaysQuery();
  const { data: matchdayIdObj = {} } = useGetCurrentMatchdayQuery();
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const fixtures = fixturesByMatchday(data);
  const totalPoints = createTotalForLoggedInUser(_id, currentPage);
  const groupedFixtures = useMemo(() => {
    const sortable = [...fixtures];
    const filtered = sortable.find((x) => x.matchday === currentPage) || {};
    const returnedFixtures =
      filtered.fixtures?.sort((x, y) => {
        if (x.kickOffTime !== y.kickOffTime) {
          return x.kickOffTime > y.kickOffTime ? 1 : -1;
        }
        return x?.teamHome?.localeCompare(y?.teamHome);
      }) || [];

    return returnedFixtures;
  }, [fixtures, currentPage]);
  const totalPages = Math.ceil(fixtures?.length / itemsPerPage);
  const min = Math.min(...fixtures.map((x) => x.matchday));
  const max = Math.max(...fixtures.map((x) => x.matchday));

  useEffect(() => {
    setCurrentPage(matchdayIdObj?.matchday);
  }, [matchdayIdObj]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className={`grid grid-cols-[1fr] justify-between items-center`}>
        <div>
          <div className="w-full overflow-x-auto space-y-4">
            <div>
              <h1 className="text-center font-bold my-2 py-2 bg-gray-900 rounded-sm text-white">
                Matchday&nbsp;{currentPage}
              </h1>
              <div>
                <div className="py-2 flex flex-col items-center points-border text-2xl bg-gray-900 text-white">
                  <div className="font-bold">Points</div>
                  <div className="font-semibold">{totalPoints}</div>
                </div>
                <>
                  {groupedFixtures.map((fixture) => (
                    <PredictionItem key={fixture._id} fixture={fixture} />
                  ))}
                </>
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <Button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage <= min}
                variant="outline"
                size="sm"
              >
                Prev
              </Button>
              <div className="text-sm">Matchday {currentPage}</div>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= max}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PredictionSection;
