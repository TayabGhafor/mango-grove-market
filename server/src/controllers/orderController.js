import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { verifyTestPayment } from "../utils/payment.js";

const DELIVERY_FEE = 200;
const FREE_DELIVERY_THRESHOLD = 2000;

const buildOrderItems = async (requestedItems) => {
  const productIds = [...new Set(requestedItems.map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: productIds }, active: true });
  const productMap = new Map(products.map((product) => [product.id, product]));

  return requestedItems.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      const error = new Error("One or more products are unavailable.");
      error.statusCode = 400;
      throw error;
    }

    const weight = product.weights.find((candidate) => candidate.kg === item.weightKg);
    if (!weight) {
      const error = new Error(`Invalid weight selected for ${product.title}.`);
      error.statusCode = 400;
      throw error;
    }

    return {
      product: product.id,
      title: product.title,
      image: product.images[0],
      weight,
      quantity: item.quantity,
    };
  });
};

export const createOrder = async (req, res, next) => {
  try {
    const paymentResult = verifyTestPayment(req.body.payment);
    if (!paymentResult.verified) {
      res.status(402).json({ message: paymentResult.reason ?? "Payment verification failed." });
      return;
    }

    const items = await buildOrderItems(req.body.items);
    const subtotal = items.reduce((sum, item) => sum + item.weight.price * item.quantity, 0);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user.id,
      items,
      customer: req.body.customer,
      subtotal,
      deliveryFee,
      total,
      payment: {
        method: req.body.payment.method,
        verified: true,
        reference: paymentResult.reference,
      },
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email role");
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};
