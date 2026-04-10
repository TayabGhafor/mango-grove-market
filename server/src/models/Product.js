import mongoose from "mongoose";

const weightSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    enum: ["3 KG", "5 KG", "8 KG"],
  },
  kg: {
    type: Number,
    required: true,
    enum: [3, 5, 8],
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 1200,
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: (value) => value.length >= 2 && value.length <= 5,
      message: "Products must have 2 to 5 images.",
    },
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 1,
  },
  weights: {
    type: [weightSchema],
    required: true,
    validate: {
      validator: (value) => {
        const keys = value.map((item) => item.kg).sort().join(",");
        return keys === "3,5,8";
      },
      message: "Products must include 3 KG, 5 KG, and 8 KG weights.",
    },
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  trending: {
    type: Boolean,
    default: false,
  },
  deal: {
    discount: {
      type: Number,
      min: 0,
      max: 90,
    },
    label: {
      type: String,
      trim: true,
      maxlength: 80,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

productSchema.index({ title: "text", description: "text", category: "text" });

export const Product = mongoose.model("Product", productSchema);
