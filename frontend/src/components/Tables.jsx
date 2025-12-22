import {
  useGetOverallTableQuery,
  useGetSingleWeeklyTableQuery,
} from "../slices/tableApiSlice";
import formattedTable from "../hooks/formattedTable";

const Tables = () => {

  const { data: overallTable = [] } = useGetOverallTableQuery();
  //const table = formattedTable(overallTable)
  console.log(overallTable)
  return <div>Tables</div>;
};

export default Tables;
