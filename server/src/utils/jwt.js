import jwt from "jsonwebtoken";

export const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }

  return jwt.sign(
    { role: user.role },
    secret,
    {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};
