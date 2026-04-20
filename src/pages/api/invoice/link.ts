import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const { id } = req.query;

    // ✅ normalize id
    const orderId = Array.isArray(id) ? id[0] : id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const SECRET = getEnv("INVOICE_SECRET");

    // 🔐 generate token
    const token = crypto
      .createHmac("sha256", SECRET)
      .update(orderId)
      .digest("hex");

    // 🌐 base url
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const link = `${baseUrl}/ebill?o=${orderId}&t=${token}`;

    return res.status(200).json({
      success: true,
      data: {
        link,
      },
    });
  } catch (error) {
    console.error("Invoice link error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}