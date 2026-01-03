import { useMemo } from "react";

export default function highestEntrant(data) {
    return useMemo(() => {
        const dataArray = [...data]
        return dataArray.map(x => {
            return {
                playerId: x?.player?._id,
                firstName: x?.player?.firstName,
                lastName: x?.player?.lastName,
                rank: x?.rank,
                points: x?.points
            }
        })
    }, [data])
}