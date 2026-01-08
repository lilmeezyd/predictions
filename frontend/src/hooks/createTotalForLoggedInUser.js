import { useMemo } from "react";
import { useGetPredictionsByPlayerQuery } from "../slices/predictionApiSlice";

export function createTotalForLoggedInUser(_id, currentPage) {
    const { data: predictions = [] } = useGetPredictionsByPlayerQuery({id: _id,mid: currentPage});
    console.log(_id)
    console.log(currentPage)
    return useMemo(() => {
        return predictions.reduce((x, y) => x+y.predictionPoints, 0)
    }, [predictions])
}