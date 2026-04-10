import express from "express";
import { createOrder, listMyOrders, listOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/schemas.js";

export const orderRoutes = express.Router();

orderRoutes.use(protect);
orderRoutes.post("/", validate(createOrderSchema), createOrder);
orderRoutes.get("/my", listMyOrders);
orderRoutes.get("/", restrictTo("admin"), listOrders);
orderRoutes.patch("/:id/status", restrictTo("admin"), validate(updateOrderStatusSchema), updateOrderStatus);
