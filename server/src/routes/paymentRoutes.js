import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { paymentSchema } from "../validators/schemas.js";

export const paymentRoutes = express.Router();

paymentRoutes.post("/verify", protect, validate(paymentSchema), verifyPayment);
