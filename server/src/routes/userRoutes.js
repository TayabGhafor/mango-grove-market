import express from "express";
import { listUsers } from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/auth.js";

export const userRoutes = express.Router();

userRoutes.get("/", protect, restrictTo("admin"), listUsers);
