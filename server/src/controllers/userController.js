import { User } from "../models/User.js";

export const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("name email role phone address createdAt").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone ?? "",
      address: req.user.address ?? "",
    },
  });
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const updates = {
      ...(req.body.name !== undefined ? { name: req.body.name } : {}),
      ...(req.body.phone !== undefined ? { phone: req.body.phone } : {}),
      ...(req.body.address !== undefined ? { address: req.body.address } : {}),
    };
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select(
      "name email role phone address",
    );
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
