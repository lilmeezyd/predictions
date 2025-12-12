import express from 'express';
const router = express.Router();
import { protect, roles } from '../middleware/authMiddleware.js';
import ROLES from "../config/permissions.js";
import { createMatchday,
  resetMatchdays,
  getMatchdays,
  getMatchday,
  setCurrentMatchday,
  updateMatchday,
  deleteMatchday,
  getCurrentMatchday } from '../controllers/matchdayController.js';

router.get('/', getMatchdays);
router.post('/', protect, roles(ROLES.ADMIN), createMatchday);
router.get('/current', getCurrentMatchday)
router.patch('/set-current-matchday', protect, roles(ROLES.ADMIN), setCurrentMatchday);
router.patch('/reset', protect, roles(ROLES.ADMIN), resetMatchdays);
router.get('/:id', getMatchday)
router.patch("/:id", protect, roles(ROLES.ADMIN), updateMatchday);
router.delete("/:id", protect, roles(ROLES.ADMIN), deleteMatchday)


export default router;