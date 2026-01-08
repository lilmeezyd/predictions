import express from "express";
import {
  makePredictions,
  getPredictionsByPlayer,
  getMyPredictions,
  predictionMadeTheMost,
  predictionMadeTheLeast,
  predictionPercentages
} from "../controllers/predictionController.js";
import { protect, roles } from "../middleware/authMiddleware.js";
import ROLES from "../config/permissions.js";
const router = express.Router();

router.route("/").put(protect, roles(ROLES.NORMAL_USER), makePredictions);
router.route("/most-prediction").get(predictionMadeTheMost)
router.route("/least-predicted").get(predictionMadeTheLeast)
router.route("/fixture/:id").get(predictionPercentages)
router.route("/:id/matchday/:mid").get(protect, getPredictionsByPlayer)
router.route("/:id/matchday/:mid/fixture/:fid").get(protect, getMyPredictions) 
export default router;
