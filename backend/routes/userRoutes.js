import express from "express";
import { protect, roles } from "../middleware/authMiddleware.js";
import ROLES from "../config/permissions.js";
import {
  authUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  getAllUsers,
  getProfile
} from "../controllers/userController.js";
const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.post("/logout", logoutUser);
router.get("/all", protect, roles(ROLES.ADMIN), getAllUsers)
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
