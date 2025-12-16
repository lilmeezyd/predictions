import { useGetMatchdaysQuery } from "../slices/matchdayApiSlice";
import { useGetTeamsQuery } from "../slices/teamApiSlice";
import { useMemo } from "react";

export default function fixturesByMatchday(fixturesByMatchday) {
  const { data = [], isLoading } = useGetMatchdaysQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  return useMemo(() => {
    const matchdayMap = new Map(data.map((x) => [x._id, x.matchdayId]));
    const teamMap = new Map(teams.map((x) => [x._id, x.name]));
    const shortNameMap = new Map(teams.map(x => [x._id, x.shortName]))
    return fixturesByMatchday.map((fixture) => {
      return {
        matchday: matchdayMap.get(fixture._id),
        fixtures: fixture.fixtures.map((team) => {
          return {
            ...team, 
            matchdayId: fixture._id,
            teamAwayId: team.teamAway,
            teamHomeId: team.teamHome,
            teamAway: teamMap.get(team.teamAway),
            teamHome: teamMap.get(team.teamHome),
            shortAway: shortNameMap.get(team.teamAway),
            shortHome: shortNameMap.get(team.teamHome),
            matchday: matchdayMap.get(team.matchday)
          };
        }),
      };
    });
  }, [data, teams, fixturesByMatchday]);
}
