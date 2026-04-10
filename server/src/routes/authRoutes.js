import express from "express";
import rateLimit from "express-rate-limit";
import { login, me, signup } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/schemas.js";

export const authRoutes = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

authRoutes.post("/signup", authLimiter, validate(signupSchema), signup);
authRoutes.post("/login", authLimiter, validate(loginSchema), login);
authRoutes.get("/me", protect, me);
