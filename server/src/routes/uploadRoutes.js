import express from "express";
import { handleProductImageUpload, uploadProductImages } from "../controllers/uploadController.js";
import { protect, restrictTo } from "../middleware/auth.js";

export const uploadRoutes = express.Router();

uploadRoutes.post("/product-images", protect, restrictTo("admin"), uploadProductImages, handleProductImageUpload);
