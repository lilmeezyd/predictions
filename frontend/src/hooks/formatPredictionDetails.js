import { useMemo } from "react";

export default function formatPredictionDetails(data) {
  return useMemo(() => {
    const outComes = [1, 2, 3];
    const newData = [...data];
    const outComeArray = newData.map((x) => x.outcome);
    const myOutComes =  outComes.map((x) =>
      outComeArray.includes(x)
        ? newData.find((y) => y.outcome === x)
        : {
            count: 0,
            outcome: x,
            percentage: 0,
          }
    ).map(x => {
        return {...x, color: '#80808078'}
    })
    const superNew =  myOutComes.filter(x => x.outcome !== 2).sort((x, y) => x.percentage < y.percentage ? 1 : -1).map((x, idx) => {
        return {
            ...x, color: idx === 0 ? '#00800078' : '#80000078'
        }
    })
    superNew.push(myOutComes.find(x => x.outcome === 2))
    superNew.sort((x, y) => x.outcome > y.outcome ? 1 : -1)
    return superNew
  }, [data]);
}
