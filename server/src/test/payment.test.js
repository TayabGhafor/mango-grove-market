import { describe, expect, it } from "vitest";
import { verifyTestPayment } from "../utils/payment.js";

const now = new Date("2026-04-10T00:00:00.000Z");

describe("verifyTestPayment", () => {
  it("accepts cash on delivery", () => {
    expect(verifyTestPayment({ method: "cod" }, now).verified).toBe(true);
  });

  it("accepts configured card test credentials", () => {
    const result = verifyTestPayment({
      method: "card",
      card: {
        number: "4242 4242 4242 4242",
        cvc: "123",
        expiry: "2026-05",
      },
    }, now);

    expect(result.verified).toBe(true);
  });

  it("rejects expired card dates", () => {
    const result = verifyTestPayment({
      method: "card",
      card: {
        number: "4242 4242 4242 4242",
        cvc: "123",
        expiry: "2026-04",
      },
    }, now);

    expect(result.verified).toBe(false);
  });

  it("accepts wallet test details", () => {
    const result = verifyTestPayment({
      method: "jazzcash",
      wallet: {
        mobileNumber: "03001234567",
        transactionId: "TEST-123456",
      },
    }, now);

    expect(result.verified).toBe(true);
  });
});
