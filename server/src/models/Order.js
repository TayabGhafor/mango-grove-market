import mongoose from "mongoose";

export const ORDER_STATUSES = ["pending", "processed", "dispatched", "out-for-delivery", "delivered"];

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  weight: {
    label: { type: String, required: true },
    kg: { type: Number, required: true, enum: [3, 5, 8] },
    price: { type: Number, required: true, min: 1 },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 99,
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (value) => value.length > 0,
      message: "Order must include at least one item.",
    },
  },
  customer: {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    address: { type: String, required: true, trim: true, maxlength: 220 },
    phone: { type: String, required: true, trim: true },
  },
  subtotal: {
    type: Number,
    required: true,
    min: 1,
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ORDER_STATUSES,
    default: "pending",
  },
  payment: {
    method: {
      type: String,
      enum: ["cod", "easypaisa", "jazzcash", "card"],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: String,
      trim: true,
    },
  },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
