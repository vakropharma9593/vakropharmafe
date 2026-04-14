import crypto from "crypto";

/**
 * Get required env variable safely
 */
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const SECRET = getEnv("INVOICE_SECRET");

/**
 * Generate secure token for invoice
 */
export const generateInvoiceToken = (orderId: string): string => {
  return crypto
    .createHmac("sha256", SECRET)
    .update(orderId)
    .digest("hex");
};

/**
 * Generate full invoice link
 */
export const generateInvoiceLink = (orderId: string): string => {
  const token = generateInvoiceToken(orderId);

  return `${process.env.NEXT_PUBLIC_BASE_URL}/ebill?o=${orderId}&t=${token}`;
};