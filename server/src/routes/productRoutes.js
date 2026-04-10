import express from "express";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/productController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { productQuerySchema, productSchema, updateProductSchema } from "../validators/schemas.js";

export const productRoutes = express.Router();

productRoutes.get("/", validate(productQuerySchema, "query"), listProducts);
productRoutes.get("/:id", getProduct);
productRoutes.post("/", protect, restrictTo("admin"), validate(productSchema), createProduct);
productRoutes.patch("/:id", protect, restrictTo("admin"), validate(updateProductSchema), updateProduct);
productRoutes.delete("/:id", protect, restrictTo("admin"), deleteProduct);
