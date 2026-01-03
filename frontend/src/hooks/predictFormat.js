import { useMemo } from "react";
import { useGetTeamsQuery } from "../slices/teamApiSlice"

export default function predictFormat(predict) {
    const { data = [] } = useGetTeamsQuery();
    const teamsMap = new Map(data.map(x => [x._id, x.name]))
    const shortMap = new Map(data.map(x => [x._id, x.shortName]))
    return useMemo(() => {
        return predict.map(x => {
            return {
                count: x.count,
                totalPredictions: x.totalPredictions,
                percentage: x.percentage,
                score: x.score,
                teamAway: teamsMap.get(x.fixture.teamAway),
                teamHome: teamsMap.get(x.fixture.teamHome),
                shortAway: shortMap.get(x.fixture.teamAway),
                shortHome: shortMap.get(x.fixture.teamHome),
            }
        })
    }, [teamsMap, shortMap, predict])
}