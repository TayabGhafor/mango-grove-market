import express from "express";
import { getMyProfile, listUsers, updateMyProfile } from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/schemas.js";

export const userRoutes = express.Router();

userRoutes.get("/me", protect, getMyProfile);
userRoutes.patch("/me", protect, validate(updateProfileSchema), updateMyProfile);
userRoutes.get("/", protect, restrictTo("admin"), listUsers);
