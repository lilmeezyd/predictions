import {useState} from "react"
import {
  useGetOverallTableQuery,
  useGetSingleWeeklyTableQuery,
} from "../slices/tableApiSlice";
import { useGetMatchdaysQuery } from "../slices/matchdayApiSlice"
import formattedTable from "../hooks/formattedTable";
import formattedMatchdays from "../hooks/formattedMatchdays"
import { useSelector } from "react-redux";
import TableDisplay from "./TableDisplay";

const Tables = () => {
  const [eventId, setEventId] = useState(null);
  const { data: matchdays = [] } = useGetMatchdaysQuery();
  const { data: overallTable = [], isLoading: isLoadingStandings } = useGetOverallTableQuery();
  const { data: weeklyTable = [], isLoading: isLoadingEvent } = useGetSingleWeeklyTableQuery(eventId, {skip: !eventId})
  const newTable = formattedTable(overallTable);
  const newWeeklyTable = formattedTable(weeklyTable);
  const { userInfo } = useSelector((state) => state.auth);
  const formattedMatchdaysArray = formattedMatchdays(matchdays)
  return (
     <div className="mt-4">
      <h4 className="text-center font-semibold">Overall Leaderboard</h4>
      <div className="font-semibold flex p-2 justify-center my-4 text-sm">
        <div className="mx-2 my-auto">
          <label htmlFor="">Sort By:</label>
        </div>
        <div className="mx-2">
          <select
          onChange={(e) => setEventId(e.target.value)}
           value={eventId || ""}
          className="p-2 border rounded" name="" id="">
            <option value="">Overall</option>
            {formattedMatchdaysArray.map(matchday => (
              <option key={matchday._id} value={matchday._id}>{matchday.name}</option>
            ))}
          </select>
        </div>
      </div>

      {eventId ? (
        <>
          {isLoadingEvent ? (
            <div>Loading...</div>
          ) : (
            <TableDisplay data={newWeeklyTable} userInfo={userInfo} />
          )}
        </>
      ) : (
        <>
          {isLoadingStandings ? (
            <div>Loading...</div>
          ) : (
            <TableDisplay data={newTable} userInfo={userInfo} />
          )}
        </>
      )}
    </div>
  );
};

export default Tables;
