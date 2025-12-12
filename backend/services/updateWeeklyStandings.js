import asyncHandler from "express-async-handler";
import { updateOverallStandings } from "./updateOverallStandings.js"

export const updateWeeklyStandings = asyncHandler(async () => {
    await updateOverallStandings();
})