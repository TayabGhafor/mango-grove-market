import { verifyTestPayment } from "../utils/payment.js";

export const verifyPayment = (req, res) => {
  const result = verifyTestPayment(req.body);
  if (!result.verified) {
    res.status(402).json({ message: result.reason ?? "Payment verification failed." });
    return;
  }

  res.json({
    verified: true,
    reference: result.reference,
  });
};
