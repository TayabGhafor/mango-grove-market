import { z } from "zod";

export type PaymentMethod = "cod" | "easypaisa" | "jazzcash" | "card";

export interface CheckoutForm {
  name: string;
  address: string;
  phone: string;
}

export interface PaymentDetails {
  mobileNumber?: string;
  transactionId?: string;
  cardNumber?: string;
  cardCvc?: string;
  cardExpiry?: string;
}

export interface CheckoutPayload {
  form: CheckoutForm;
  payment: PaymentMethod;
  paymentDetails: PaymentDetails;
}

export interface CheckoutValidationResult {
  success: boolean;
  errors: string[];
}

const pakistanPhoneRegex = /^03\d{9}$/;
const transactionIdRegex = /^[a-zA-Z0-9-]{6,40}$/;

const checkoutSchema = z.object({
  form: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80, "Name is too long."),
    address: z.string().trim().min(10, "Address must be at least 10 characters.").max(220, "Address is too long."),
    phone: z.string().trim().regex(pakistanPhoneRegex, "Phone must be an 11 digit Pakistani mobile number, for example 03001234567."),
  }),
  payment: z.enum(["cod", "easypaisa", "jazzcash", "card"]),
  paymentDetails: z.object({
    mobileNumber: z.string().optional(),
    transactionId: z.string().optional(),
    cardNumber: z.string().optional(),
    cardCvc: z.string().optional(),
    cardExpiry: z.string().optional(),
  }),
});

const normalizeCardNumber = (value = "") => value.replace(/\s+/g, "");

const parseExpiry = (value = "") => {
  const trimmed = value.trim();
  const monthInputMatch = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (monthInputMatch) {
    return {
      year: Number(monthInputMatch[1]),
      month: Number(monthInputMatch[2]),
    };
  }

  const slashMatch = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.exec(trimmed);
  if (!slashMatch) return null;

  const yearValue = Number(slashMatch[2]);
  return {
    month: Number(slashMatch[1]),
    year: slashMatch[2].length === 2 ? 2000 + yearValue : yearValue,
  };
};

const isExpiryFuture = (value: string | undefined, now: Date) => {
  const parsed = parseExpiry(value);
  if (!parsed || parsed.month < 1 || parsed.month > 12) return false;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return parsed.year > currentYear || (parsed.year === currentYear && parsed.month > currentMonth);
};

export const validateCheckout = (payload: CheckoutPayload, now = new Date()): CheckoutValidationResult => {
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const { payment, paymentDetails } = parsed.data;
  const errors: string[] = [];

  if (payment === "easypaisa" || payment === "jazzcash") {
    if (!paymentDetails.mobileNumber || !pakistanPhoneRegex.test(paymentDetails.mobileNumber.trim())) {
      errors.push("Wallet number must be an 11 digit Pakistani mobile number.");
    }

    if (!paymentDetails.transactionId || !transactionIdRegex.test(paymentDetails.transactionId.trim())) {
      errors.push("Transaction id must be 6 to 40 letters, numbers, or hyphens.");
    }
  }

  if (payment === "card") {
    if (normalizeCardNumber(paymentDetails.cardNumber) !== "4242424242424242") {
      errors.push("Use the test card number 4242 4242 4242 4242.");
    }

    if ((paymentDetails.cardCvc ?? "").trim() !== "123") {
      errors.push("Use the test CVC 123.");
    }

    if (!isExpiryFuture(paymentDetails.cardExpiry, now)) {
      errors.push("Card expiry must be later than the current month.");
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
};
