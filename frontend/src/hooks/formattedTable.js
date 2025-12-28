import { useMemo } from "react";

export default function formattedTable (table) {
    return useMemo(() => {
        const newTable = table.map(x => {
            return {
                firstName: x?.player?.firstName,
                lastName: x?.player?.lastName,
                playerId: x?.player?._id,
                rank: x?.rank,
                oldRank: x?.oldRank,
                points: x?.points
            }
        }).sort((x,y) => y?.rank > x?.rank ? -1 : 1)
        return newTable
    }, [table])
}