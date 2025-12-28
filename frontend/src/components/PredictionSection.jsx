import { useMemo, useState, useEffect } from "react";
import { useGetFixturesQuery } from "../slices/fixtureApiSlice";
import { useGetTeamsQuery } from "../slices/teamApiSlice";
import { useGetMatchdaysQuery, useGetCurrentMatchdayQuery } from "../slices/matchdayApiSlice";
import fixturesByMatchday from "../hooks/fixturesByMatchday";
import PredictionItem from "./PredictionItem";

const PredictionSection = () => {
  const { data = [], isLoading } = useGetFixturesQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: matchdays = [] } = useGetMatchdaysQuery();
  const { data: matchdayIdObj = {} } = useGetCurrentMatchdayQuery();
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const fixtures = fixturesByMatchday(data);
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

  useEffect(() => {
    setCurrentPage(matchdayIdObj?.matchday);
  }, [matchdayIdObj])

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
                <PredictionItem key={fixture._id} fixture={fixture} />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="text-sm px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="text-sm px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PredictionSection;
