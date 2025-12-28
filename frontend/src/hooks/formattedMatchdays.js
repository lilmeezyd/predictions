import { useMemo } from "react";

export default function formattedMatchdays(matchdays) {
  return useMemo(() => {
    const newArray = [...matchdays];
    return newArray
      .filter((x) => (x.finished  || x.current))
      .sort((x, y) => (y.matchdayId > x.matchdayId ? -1 : 1));
  }, [matchdays]);
}
