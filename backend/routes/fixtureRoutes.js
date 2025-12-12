import express from "express";
import {
  setFixture,
  getFixtures,
  editFixture,
  editScores,
  deleteFixture,
  getFixture,
} from "../controllers/fixtureController.js";
import { protect, roles } from "../middleware/authMiddleware.js";
import ROLES from "../config/permissions.js";
const router = express.Router();

router
  .route("/")
  .get(getFixtures)
  .post(protect, roles(ROLES.ADMIN), setFixture);
router
  .route("/:id/scores")
  .patch(editScores);
router
  .route("/:id")
  .get(getFixture)
  .patch(protect, roles(ROLES.ADMIN, ROLES.EDITOR), editFixture)
  .delete(protect, roles(ROLES.ADMIN), deleteFixture);

export default router;
