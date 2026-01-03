import express from "express";
import {
  getOverallTable,
  getWeeklyTables,
  getSingleWeeklyTable,
  getHighestScoringEntrant
} from "../controllers/standingController.js";
import { protect, roles } from "../middleware/authMiddleware.js";
import ROLES from "../config/permissions.js"

const router = express.Router();
router.route("/").get(getOverallTable);
router.route("/weekly-highest").get(getHighestScoringEntrant);
router.route("/matchdays").get(getWeeklyTables)
router.route("/matchdays/:id").get(getSingleWeeklyTable)
export default router;