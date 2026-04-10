import { describe, expect, it } from "vitest";
import { validateCheckout } from "@/lib/checkoutValidation";

const validForm = {
  name: "Ahmed Khan",
  address: "123 Gulberg Lahore",
  phone: "03001234567",
};

const now = new Date("2026-04-10T00:00:00.000Z");

describe("validateCheckout", () => {
  it("accepts COD with valid delivery details", () => {
    const result = validateCheckout({
      form: validForm,
      payment: "cod",
      paymentDetails: {},
    }, now);

    expect(result.success).toBe(true);
  });

  it("rejects invalid delivery phone numbers", () => {
    const result = validateCheckout({
      form: { ...validForm, phone: "12345" },
      payment: "cod",
      paymentDetails: {},
    }, now);

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("Phone");
  });

  it("accepts the configured card test credentials with a future expiry", () => {
    const result = validateCheckout({
      form: validForm,
      payment: "card",
      paymentDetails: {
        cardNumber: "4242 4242 4242 4242",
        cardCvc: "123",
        cardExpiry: "2026-05",
      },
    }, now);

    expect(result.success).toBe(true);
  });

  it("rejects card expiry that is not later than the current month", () => {
    const result = validateCheckout({
      form: validForm,
      payment: "card",
      paymentDetails: {
        cardNumber: "4242 4242 4242 4242",
        cardCvc: "123",
        cardExpiry: "2026-04",
      },
    }, now);

    expect(result.success).toBe(false);
    expect(result.errors).toContain("Card expiry must be later than the current month.");
  });

  it("requires wallet number and transaction id for wallet payments", () => {
    const result = validateCheckout({
      form: validForm,
      payment: "easypaisa",
      paymentDetails: {
        mobileNumber: "03001234567",
        transactionId: "TEST-123456",
      },
    }, now);

    expect(result.success).toBe(true);
  });
});
