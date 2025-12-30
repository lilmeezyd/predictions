import { useMemo, useState, useEffect } from "react";
import { useGetFixturesQuery } from "../slices/fixtureApiSlice";
import { useGetTeamsQuery } from "../slices/teamApiSlice";
import {
  useGetMatchdayMaxNMinQuery,
  useGetCurrentMatchdayQuery,
  useGetMatchdaysQuery,
} from "../slices/matchdayApiSlice";
import { Button } from "../../@/components/ui/button";
import fixturesByMatchday from "../hooks/fixturesByMatchday";
import FixtureItem from "./FixtureItem";

const NormalFixtures = () => {
  const { data = [], isLoading } = useGetFixturesQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: matchdays = [] } = useGetMatchdaysQuery();
  const { data: matchdayData = {} } = useGetCurrentMatchdayQuery();
  const { data: minMaxData = {} } = useGetMatchdayMaxNMinQuery();
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const fixtures = fixturesByMatchday(data);
  const min = minMaxData?.min;
  const max = minMaxData?.max;

  useEffect(() => {
    setCurrentPage(matchdayData?.matchday);
  }, [matchdayData]);
  const groupedFixtures = useMemo(() => {
    const sortable = [...fixtures];
    const filtered = sortable.find((x) => x.matchday === currentPage) || {};
    const returnedFixtures =
      filtered.fixtures?.sort((x, y) => {
        if (x.kickOffTime !== y.kickOffTime) {
          return x.kickOffTime > y.kickOffTime ? 1 : -1;
        }
        return x.teamHome?.localeCompare(y.teamHome);
      }) || [];

    return returnedFixtures;
  }, [fixtures, currentPage]);
  const totalPages = Math.ceil(fixtures?.length / itemsPerPage);

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
              {groupedFixtures.map((fixture) => (
                <FixtureItem key={fixture._id} fixture={fixture} />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <Button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === min}
                variant="outline"
                size="sm"
              >
                Prev
              </Button>
              <div className="text-sm">Matchday {currentPage}</div>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === max}
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

export default NormalFixtures;
