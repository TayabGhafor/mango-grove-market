export const TEST_CARD_NUMBER = "4242424242424242";
export const TEST_CARD_CVC = "123";

const pakistanPhoneRegex = /^03\d{9}$/;
const transactionIdRegex = /^[a-zA-Z0-9-]{6,40}$/;

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

const isFutureExpiry = (expiry, now) => {
  const parsed = parseExpiry(expiry);
  if (!parsed || parsed.month < 1 || parsed.month > 12) return false;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return parsed.year > currentYear || (parsed.year === currentYear && parsed.month > currentMonth);
};

export const verifyTestPayment = (payment, now = new Date()) => {
  if (payment.method === "cod") {
    return { verified: true, reference: `COD-${Date.now()}` };
  }

  if (payment.method === "card") {
    const card = payment.card ?? {};
    const cardNumber = String(card.number ?? "").replace(/\s+/g, "");
    if (cardNumber !== TEST_CARD_NUMBER || String(card.cvc ?? "").trim() !== TEST_CARD_CVC || !isFutureExpiry(card.expiry, now)) {
      return { verified: false, reason: "Invalid card test credentials." };
    }

    return { verified: true, reference: `CARD-TEST-${Date.now()}` };
  }

  if (payment.method === "easypaisa" || payment.method === "jazzcash") {
    const wallet = payment.wallet ?? {};
    if (!pakistanPhoneRegex.test(String(wallet.mobileNumber ?? "").trim()) || !transactionIdRegex.test(String(wallet.transactionId ?? "").trim())) {
      return { verified: false, reason: "Invalid wallet payment details." };
    }

    return { verified: true, reference: String(wallet.transactionId).trim() };
  }

  return { verified: false, reason: "Unsupported payment method." };
};
