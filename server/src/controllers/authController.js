import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone ?? "",
  address: user.address ?? "",
});

const sendAuthResponse = (user, statusCode, res) => {
  res.status(statusCode).json({
    token: signToken(user),
    user: publicUser(user),
  });
};

export const signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    sendAuthResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    sendAuthResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ user: publicUser(req.user) });
};
